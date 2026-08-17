// Crea una sesion de pago de Stripe Checkout.
// El PRECIO se toma del servidor (catalogo base + Firestore), nunca del cliente,
// para que nadie pueda alterar el total desde el navegador.
import Stripe from "stripe"
import { products as catalogProducts } from "../src/data/catalog.js"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" })
    return
  }

  try {
    const { items = [], customer = {} } = req.body || {}
    if (!items.length) {
      res.status(400).json({ error: "El carrito esta vacio." })
      return
    }

    const line_items = []

    for (const item of items) {
      // Toma el precio real del catalogo (en el servidor, no del cliente).
      const product = catalogProducts.find((p) => p.id === item.productId)
      if (!product) continue

      line_items.push({
        quantity: Math.max(1, Number(item.quantity) || 1),
        price_data: {
          currency: "usd",
          unit_amount: Math.round(Number(product.price) * 100),
          product_data: { name: product.name?.es || product.name?.en || "Producto" },
        },
      })
    }

    if (!line_items.length) {
      res.status(400).json({ error: "No se encontraron los productos." })
      return
    }

    const origin = req.headers.origin || `https://${req.headers.host}`

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,
      success_url: `${origin}/pago-exitoso?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout`,
      customer_email: customer.email || undefined,
      // Guardamos los datos del pedido para que el webhook los registre despues del pago.
      metadata: {
        name: customer.name || "",
        phone: customer.phone || "",
        method: customer.method || "",
        address: [customer.address, customer.address2, customer.city, customer.state, customer.zip].filter(Boolean).join(", "),
        eventType: customer.eventType || "",
        eventDate: customer.eventDate || "",
        notes: customer.notes || "",
      },
    })

    res.status(200).json({ url: session.url })
  } catch (err) {
    console.error("Error en /api/checkout:", err)
    res.status(500).json({ error: "No se pudo iniciar el pago." })
  }
}
