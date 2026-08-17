// Webhook de Stripe: se ejecuta cuando un pago se completa.
// Verifica la firma (que de verdad viene de Stripe) y guarda el pedido pagado
// en Firestore usando Firebase Admin (sin depender del navegador del cliente).
import Stripe from "stripe"
import { getAdminDb } from "./_firebaseAdmin.js"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

// Necesitamos el cuerpo SIN procesar para validar la firma de Stripe.
export const config = { api: { bodyParser: false } }

async function readRawBody(readable) {
  const chunks = []
  for await (const chunk of readable) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk)
  }
  return Buffer.concat(chunks)
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).end()
    return
  }

  let event
  try {
    const rawBody = await readRawBody(req)
    const signature = req.headers["stripe-signature"]
    event = stripe.webhooks.constructEvent(rawBody, signature, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`)
    return
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object
    try {
      const lineItems = await stripe.checkout.sessions.listLineItems(session.id, { limit: 100 })
      const db = getAdminDb()
      await db.collection("orders").add({
        reference: `VB-${session.id.slice(-8).toUpperCase()}`,
        status: "pagado",
        paymentStatus: session.payment_status,
        amountTotal: (session.amount_total || 0) / 100,
        currency: session.currency,
        customer: {
          email: session.customer_details?.email || "",
          name: session.metadata?.name || session.customer_details?.name || "",
          phone: session.metadata?.phone || "",
          method: session.metadata?.method || "",
          address: session.metadata?.address || "",
          eventType: session.metadata?.eventType || "",
          eventDate: session.metadata?.eventDate || "",
          notes: session.metadata?.notes || "",
        },
        lines: lineItems.data.map((li) => ({
          name: li.description,
          quantity: li.quantity,
          amount: (li.amount_total || 0) / 100,
        })),
        stripeSessionId: session.id,
        createdAt: new Date().toISOString(),
      })
    } catch (err) {
      console.error("Error guardando el pedido:", err)
      res.status(500).send("Error saving order")
      return
    }
  }

  res.status(200).json({ received: true })
}
