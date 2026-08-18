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

// Direccion de remitente (aparece en la etiqueta).
const FROM_ADDRESS = {
  name: "Valerie's Boutique",
  street1: "19 W Market St",
  city: "Salinas",
  state: "CA",
  zip: "93901",
  country: "US",
  phone: "8319980610",
}

// Compra la etiqueta USPS mas barata para un pedido y devuelve el PDF + tracking.
export async function buyUspsLabel(to, weightOz) {
  const token = process.env.SHIPPO_API_KEY
  if (!token) throw new Error("Falta la llave de Shippo")
  const headers = { Authorization: `ShippoToken ${token}`, "Content-Type": "application/json" }

  // 1) Crear el envio y obtener tarifas
  const shipRes = await fetch("https://api.goshippo.com/shipments/", {
    method: "POST",
    headers,
    body: JSON.stringify({
      address_from: FROM_ADDRESS,
      address_to: {
        name: to.name || "Cliente",
        street1: to.street || "",
        street2: to.address2 || "",
        city: to.city || "",
        state: to.state || "",
        zip: to.zip || "",
        country: "US",
        phone: to.phone || "",
      },
      parcels: [{
        length: "14", width: "11", height: "4", distance_unit: "in",
        weight: String(Math.max(1, Number(weightOz) || 16)), mass_unit: "oz",
      }],
      async: false,
    }),
  })
  const shipment = await shipRes.json()
  const rates = (shipment.rates || []).filter((rate) => rate.provider === "USPS")
  if (!rates.length) throw new Error("No hay tarifas USPS para esa direccion")
  const cheapest = rates.reduce((a, b) => (Number(a.amount) <= Number(b.amount) ? a : b))

  // 2) Comprar la etiqueta
  const txRes = await fetch("https://api.goshippo.com/transactions/", {
    method: "POST",
    headers,
    body: JSON.stringify({ rate: cheapest.object_id, label_file_type: "PDF", async: false }),
  })
  const tx = await txRes.json()
  if (tx.status !== "SUCCESS") {
    const msg = (tx.messages || []).map((m) => m.text).join("; ") || "No se pudo comprar la etiqueta"
    throw new Error(msg)
  }

  return {
    labelUrl: tx.label_url,
    tracking: tx.tracking_number,
    amount: Number(cheapest.amount),
    service: cheapest.servicelevel?.name || "USPS",
  }
}
