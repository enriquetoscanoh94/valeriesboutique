// Compra la etiqueta USPS de un pedido (solo la administradora).
import { buyUspsLabel } from "./_shipping.js"
import { isAdminRequest } from "./_firebaseAdmin.js"

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" })
    return
  }

  // Solo la admin puede comprar etiquetas (se verifica su token de Firebase).
  if (!(await isAdminRequest(req))) {
    res.status(403).json({ error: "No autorizado." })
    return
  }

  try {
    const { to = {}, weightOz } = req.body || {}
    const label = await buyUspsLabel(to, weightOz)
    res.status(200).json(label)
  } catch (err) {
    console.error("Error en /api/buy-label:", err)
    res.status(500).json({ error: err.message || "No se pudo comprar la etiqueta." })
  }
}
