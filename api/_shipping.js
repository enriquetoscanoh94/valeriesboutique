// Cotizacion de envios USPS via Shippo (lado servidor).
import { products as catalogProducts } from "../src/data/catalog.js"

// Peso estimado por tipo de producto, en ONZAS (redondeado HACIA ARRIBA
// para que el cliente nunca pague de menos y el negocio no pierda).
const WEIGHT_OZ_BY_CATEGORY = {
  xv: 64,            // vestido de XV (~4 lb con empaque)
  novias: 72,        // vestido de novia (~4.5 lb)
  fiesta: 28,        // vestido de fiesta
  nina: 20,          // vestido de nina
  "bautizo-ninos": 28,
  ramos: 20,
  corsages: 12,
  accesorios: 16,
  brindis: 40,       // copas/juegos (fragil, mas empaque)
  promociones: 72,   // paquetes completos
}
const DEFAULT_WEIGHT_OZ = 32

function weightForProduct(product) {
  return WEIGHT_OZ_BY_CATEGORY[product?.category] ?? DEFAULT_WEIGHT_OZ
}

// Suma el peso total del carrito (onzas), minimo 1.
export function totalWeightOz(items) {
  let ounces = 0
  for (const item of items) {
    const product = catalogProducts.find((p) => p.id === item.productId)
    const quantity = Math.max(1, Number(item.quantity) || 1)
    ounces += weightForProduct(product) * quantity
  }
  return Math.max(1, ounces)
}

// Cotiza el envio USPS mas barato desde Salinas (93901) al ZIP destino via Shippo.
// Devuelve { amount, service } o null si no hay tarifas.
export async function quoteUspsShipping(zip, items) {
  const token = process.env.SHIPPO_API_KEY
  if (!token) return null

  const weight = totalWeightOz(items)

  const response = await fetch("https://api.goshippo.com/shipments/", {
    method: "POST",
    headers: {
      Authorization: `ShippoToken ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      address_from: { zip: "93901", country: "US" },
      address_to: { zip, country: "US" },
      parcels: [{
        length: "14", width: "11", height: "4", distance_unit: "in",
        weight: String(weight), mass_unit: "oz",
      }],
      async: false,
    }),
  })

  const data = await response.json()
  const rates = (data.rates || []).filter((rate) => rate.provider === "USPS")
  if (!rates.length) return null

  const cheapest = rates.reduce((a, b) => (Number(a.amount) <= Number(b.amount) ? a : b))
  return { amount: Number(cheapest.amount), service: cheapest.servicelevel?.name || "USPS" }
}
