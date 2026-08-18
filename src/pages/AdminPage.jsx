import { useMemo, useState } from "react"
import { addDoc, collection, deleteDoc, doc, serverTimestamp } from "firebase/firestore"
import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage"
import { db, storage } from "../firebase"
import { useProducts } from "../context/ProductsContext"
import { useLanguage } from "../context/LanguageContext"
import { categories, imageUrl, palette } from "../data/catalog"

const paletteList = Object.values(palette)

const EMPTY = {
  nameEs: "", category: categories[0].slug, subcategory: "0",
  price: "", sizes: "", weightLb: "", descEs: "", featured: false,
}

// Seccion "Productos" del panel (protegida por AdminLayout).
export default function AdminPage() {
  const { dbProducts } = useProducts()
  const { localize } = useLanguage()

  const [form, setForm] = useState(EMPTY)
  const [colors, setColors] = useState([])
  const [customColors, setCustomColors] = useState([]) // colores propios: [{ name, hex }]
  const [newColorName, setNewColorName] = useState("")
  const [newColorHex, setNewColorHex] = useState("#d99aaa")
  const [file, setFile] = useState(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")
  const [ok, setOk] = useState("")

  const currentCategory = useMemo(() => categories.find((cat) => cat.slug === form.category), [form.category])
  const subNames = currentCategory ? currentCategory.subcategories.es : []

  const setField = (event) => {
    const { name, value, type, checked } = event.target
    if (name === "category") { setForm({ ...form, category: value, subcategory: "0" }); return }
    setForm({ ...form, [name]: type === "checkbox" ? checked : value })
  }

  const toggleColor = (value) => {
    setColors((current) => current.includes(value) ? current.filter((item) => item !== value) : [...current, value])
  }

  // Agrega un color que no esta en la paleta (nombre + tono elegido).
  const addCustomColor = () => {
    const name = newColorName.trim()
    if (!name) return
    setCustomColors([...customColors, { name, hex: newColorHex }])
    setNewColorName("")
  }
  const removeCustomColor = (index) => setCustomColors(customColors.filter((_, i) => i !== index))

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError(""); setOk("")
    if (!form.nameEs.trim() || !form.price || !file) {
      setError("Faltan datos: nombre, precio y foto son obligatorios.")
      return
    }
    setBusy(true)
    try {
      // 1) Subir la foto a Storage y obtener su URL publica.
      const path = `products/${Date.now()}-${file.name}`
      const storageRef = ref(storage, path)
      await uploadBytes(storageRef, file)
      const url = await getDownloadURL(storageRef)

      // 2) Guardar el producto en la base de datos con el mismo formato del catalogo.
      const subIndex = Number(form.subcategory)
      // Colores de la paleta + los colores propios que agrego la duena.
      const chosenColors = [
        ...paletteList.filter((color) => colors.includes(color.value)),
        ...customColors.map((color) => ({
          name: { es: color.name, en: color.name },
          value: color.name.toLowerCase().replace(/\s+/g, "-"),
          hex: color.hex,
        })),
      ]
      await addDoc(collection(db, "products"), {
        category: form.category,
        subcategory: String(form.subcategory),
        // Se guarda el mismo texto en ambos idiomas (la tienda es en español).
        name: { es: form.nameEs.trim(), en: form.nameEs.trim() },
        description: { es: form.descEs.trim(), en: form.descEs.trim() },
        price: Number(form.price),
        images: [url],
        imagePath: path,
        sizes: form.sizes.split(",").map((size) => size.trim()).filter(Boolean),
        colors: chosenColors,
        // Peso para el envio: se guarda en onzas (16 oz = 1 lb). Si se deja vacio,
        // el sistema usa un estimado por tipo de producto.
        weightOz: form.weightLb ? Math.round(Number(form.weightLb) * 16) : null,
        featured: form.featured,
        badge: { es: currentCategory.subcategories.es[subIndex], en: currentCategory.subcategories.en[subIndex] },
        createdAt: serverTimestamp(),
      })

      setOk("Producto agregado ✓")
      setForm(EMPTY); setColors([]); setCustomColors([]); setFile(null)
      event.target.reset()
    } catch (err) {
      setError("No se pudo guardar: " + (err.message || err.code || "error"))
    } finally {
      setBusy(false)
    }
  }

  const handleDelete = async (product) => {
    if (!window.confirm(`¿Borrar "${localize(product.name)}"?`)) return
    try {
      await deleteDoc(doc(db, "products", product.id))
      if (product.imagePath) await deleteObject(ref(storage, product.imagePath)).catch(() => {})
    } catch (err) {
      setError("No se pudo borrar: " + (err.message || err.code || "error"))
    }
  }

  return (
    <>
      <h2 className="admin-section-title">Productos</h2>
      <p className="admin-sub">Agrega productos nuevos a la tienda. Aparecerán al instante en el catálogo.</p>

      <div className="admin-layout">
        <form className="admin-form" onSubmit={handleSubmit}>
          <h2>Agregar producto</h2>

          <div className="field"><label htmlFor="nameEs">Nombre del producto *</label><input id="nameEs" name="nameEs" value={form.nameEs} onChange={setField} /></div>

          <div className="field-row">
            <div className="field">
              <label htmlFor="category">Categoría *</label>
              <select id="category" name="category" value={form.category} onChange={setField}>
                {categories.map((cat) => <option key={cat.slug} value={cat.slug}>{cat.name.es}</option>)}
              </select>
            </div>
            <div className="field">
              <label htmlFor="subcategory">Subcategoría</label>
              <select id="subcategory" name="subcategory" value={form.subcategory} onChange={setField}>
                {subNames.map((name, index) => <option key={name} value={String(index)}>{name}</option>)}
              </select>
            </div>
          </div>

          <div className="field-row thirds">
            <div className="field"><label htmlFor="price">Precio (USD) *</label><input id="price" name="price" type="number" min="0" step="1" value={form.price} onChange={setField} /></div>
            <div className="field"><label htmlFor="weightLb">Peso aprox. (libras)</label><input id="weightLb" name="weightLb" type="number" min="0" step="0.1" value={form.weightLb} onChange={setField} placeholder="ej. 2.5" /></div>
            <div className="field"><label htmlFor="sizes">Tallas (coma)</label><input id="sizes" name="sizes" value={form.sizes} onChange={setField} placeholder="4, 6, 8" /></div>
          </div>
          <p className="admin-hint">El peso ayuda a cotizar el envío exacto. Si lo dejas vacío, se usa un estimado por tipo de producto.</p>

          <div className="field">
            <label>Colores disponibles</label>
            <div className="admin-colors">
              {paletteList.map((color) => (
                <button type="button" key={color.value} className={`admin-color ${colors.includes(color.value) ? "is-on" : ""}`} onClick={() => toggleColor(color.value)}>
                  <span style={{ background: color.hex }} />{color.name.es}
                </button>
              ))}
              {customColors.map((color, index) => (
                <button type="button" key={`custom-${index}`} className="admin-color is-on" onClick={() => removeCustomColor(index)} title="Quitar">
                  <span style={{ background: color.hex }} />{color.name} ✕
                </button>
              ))}
            </div>
            <div className="admin-add-color">
              <input type="color" aria-label="Tono del color" value={newColorHex} onChange={(event) => setNewColorHex(event.target.value)} />
              <input type="text" placeholder="¿No está tu color? Escríbelo (ej. rosa palo)" value={newColorName} onChange={(event) => setNewColorName(event.target.value)}
                onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); addCustomColor() } }} />
              <button type="button" className="button button-outline" onClick={addCustomColor}>Agregar color</button>
            </div>
          </div>

          <div className="field"><label htmlFor="descEs">Descripción</label><textarea id="descEs" name="descEs" value={form.descEs} onChange={setField} /></div>

          <div className="field"><label htmlFor="photo">Foto del producto *</label><input id="photo" type="file" accept="image/*" onChange={(event) => setFile(event.target.files[0])} /></div>

          <label className="admin-check"><input type="checkbox" name="featured" checked={form.featured} onChange={setField} /> Mostrar como destacado en la página principal</label>

          {error && <p className="form-error">{error}</p>}
          {ok && <p className="admin-ok">{ok}</p>}

          <button className="button button-dark" type="submit" disabled={busy}>{busy ? "Guardando…" : "Agregar producto"}</button>
        </form>

        <aside className="admin-list">
          <h3>Tus productos ({dbProducts.length})</h3>
          {dbProducts.length === 0 ? (
            <p className="admin-empty">Aún no has agregado productos. Los del catálogo base no se listan aquí.</p>
          ) : (
            <ul>
              {dbProducts.map((product) => (
                <li key={product.id}>
                  <img src={imageUrl(product.images?.[0])} alt={localize(product.name)} />
                  <div>
                    <p className="admin-list-name">{localize(product.name)}</p>
                    <p className="admin-list-meta">${Number(product.price).toFixed(2)} · {product.category}</p>
                  </div>
                  <button type="button" className="remove-button" onClick={() => handleDelete(product)}>Borrar</button>
                </li>
              ))}
            </ul>
          )}
        </aside>
      </div>
    </>
  )
}
