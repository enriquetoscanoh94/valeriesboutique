// Genera public/sitemap.xml con todas las paginas publicas del sitio:
// inicio, la pagina de visitas/citas, cada categoria y cada producto.
// Para regenerarlo despues de agregar productos: node scripts/generate-sitemap.mjs
import { writeFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"
import { categories, products } from "../src/data/catalog.js"

const SITE = "https://www.valeriesboutiques.com"

// Paginas fijas + categorias + productos
const rutas = [
  "/",
  "/visita-citas",
  ...categories.map((c) => `/categoria/${c.slug}`),
  ...products.map((p) => `/producto/${p.id}`),
]

const hoy = new Date().toISOString().slice(0, 10)

const urls = rutas
  .map((ruta) => `  <url>\n    <loc>${SITE}${ruta}</loc>\n    <lastmod>${hoy}</lastmod>\n  </url>`)
  .join("\n")

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`

const salida = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "sitemap.xml")
writeFileSync(salida, xml)
console.log(`sitemap.xml generado con ${rutas.length} URLs`)
