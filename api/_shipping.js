// Cotizacion de envios USPS via Shippo (lado servidor).
import { products as catalogProducts } from "../src/data/catalog.js"
import { business } from "../src/data/business.js"
import { getAdminDb } from "./_firebaseAdmin.js"

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

// Colchon que se suma al costo de envio que se le cobra al cliente (en dolares),
// para que el negocio nunca pierda. Cambia este numero si quieres mas o menos margen.
const HANDLING_BUFFER_USD = 2

function weightForProduct(product) {
  // 1) Si la admin le puso un peso al producto, se usa ese.
  if (product?.weightOz) return Number(product.weightOz)
  // 2) Si no, un estimado por tipo de producto.
  return WEIGHT_OZ_BY_CATEGORY[product?.category] ?? DEFAULT_WEIGHT_OZ
}

// Suma el peso total del carrito (onzas), minimo 1.
// Los productos base estan en el codigo; los que agrega la admin, en Firestore.
export async function totalWeightOz(items) {
  let db = null
  let ounces = 0
  for (const item of items) {
    let product = catalogProducts.find((p) => p.id === item.productId)
    if (!product) {
      try {
        if (!db) db = getAdminDb()
        const snap = await db.collection("products").doc(item.productId).get()
        if (snap.exists) product = snap.data()
      } catch { /* si falla, se usa el peso por defecto */ }
    }
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

  const weight = await totalWeightOz(items)

  const response = await fetch("https://api.goshippo.com/shipments/", {
    method: "POST",
    headers: {
      Authorization: `ShippoToken ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      address_from: { zip: business.zip, country: "US" },
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
  // Costo real de USPS + colchon, redondeado hacia arriba al siguiente dolar.
  // Asi el cliente paga unos dolares de mas y el negocio nunca pierde en el envio.
  const amount = Math.ceil(Number(cheapest.amount) + HANDLING_BUFFER_USD)
  return { amount, service: cheapest.servicelevel?.name || "USPS" }
}

// Direccion de remitente (aparece en la etiqueta). Datos del negocio centralizados.
const FROM_ADDRESS = {
  name: business.name,
  street1: business.street,
  city: business.city,
  state: business.state,
  zip: business.zip,
  country: "US",
  phone: business.phone,
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
