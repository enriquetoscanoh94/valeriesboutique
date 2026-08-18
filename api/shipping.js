// Ruta API para cotizar el envio USPS y mostrarlo en el checkout.
import { quoteUspsShipping } from "./_shipping.js"

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" })
    return
  }

  try {
    const { zip, items = [] } = req.body || {}
    if (!zip || !items.length) {
      res.status(400).json({ error: "Falta el codigo postal o los productos." })
      return
    }

    const quote = await quoteUspsShipping(zip, items)
    if (!quote) {
      res.status(200).json({ amount: null })
      return
    }

    res.status(200).json(quote)
  } catch (err) {
    console.error("Error en /api/shipping:", err)
    res.status(500).json({ error: "No se pudo cotizar el envio." })
  }
}
