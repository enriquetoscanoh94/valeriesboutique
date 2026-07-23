import { useEffect, useMemo, useState } from "react"
import { Link, Navigate, useParams } from "react-router-dom"
import ProductCard from "../components/ProductCard"
import { useCart } from "../context/CartContext"
import { useLanguage } from "../context/LanguageContext"
import { getCategory, getProduct, products } from "../data/catalog"

export default function ProductPage() {
  const { id } = useParams()
  const product = getProduct(id)
  const { addItem } = useCart()
  const { localize, t } = useLanguage()
  const [size, setSize] = useState("")
  const [color, setColor] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [error, setError] = useState("")
  const [added, setAdded] = useState(false)

  useEffect(() => {
    setSize("")
    setColor(product?.colors?.[0]?.value || "")
    setQuantity(1)
    setError("")
    setAdded(false)
  }, [id, product])

  const related = useMemo(() => products.filter((item) => item.id !== id && (item.category === product?.category || item.featured)).slice(0, 3), [id, product])
  if (!product) return <Navigate to="/404" replace />
  const category = getCategory(product.category)
  const handleAdd = () => {
    if (product.sizes.length && !size) return setError(t.product.sizeRequired)
    if (product.colors.length && !color) return setError(t.product.colorRequired)
    addItem(product, { size, color, quantity })
    setError("")
    setAdded(true)
    window.setTimeout(() => setAdded(false), 2200)
  }

  return (
    <div className="product-page">
      <nav className="breadcrumbs" aria-label="Breadcrumb"><Link to="/">{t.nav.home}</Link><span>/</span><Link to={`/categoria/${category.slug}`}>{localize(category.name)}</Link><span>/</span><span>{localize(product.name)}</span></nav>
      <section className="product-detail">
        <div className="product-gallery"><img src={`${import.meta.env.BASE_URL}${product.images[0]}`} alt={localize(product.name)} width="900" height="1125" /></div>
        <div className="product-info">
          <p className="eyebrow">{localize(category.name)}</p><h1>{localize(product.name)}</h1>
          <p className="product-detail-price">${product.price.toFixed(2)}</p><p className="installments">{t.product.payments} ${(product.price / 4).toFixed(2)} · Afterpay</p>
          <p className="product-description">{localize(product.description)}</p>
          {product.sizes.length > 0 && <fieldset className="option-group"><legend>{t.product.selectSize}</legend><div className="size-options">{product.sizes.map((item) => <button type="button" key={item} className={size === item ? "selected" : ""} onClick={() => { setSize(item); setError("") }}>{item}</button>)}</div></fieldset>}
          {product.colors.length > 0 && <fieldset className="option-group"><legend>{t.product.selectColor}</legend><div className="color-options">{product.colors.map((item) => <button type="button" key={item.value} className={color === item.value ? "selected" : ""} onClick={() => { setColor(item.value); setError("") }}><span style={{ background: item.hex }} />{localize(item.name)}</button>)}</div></fieldset>}
          <div className="purchase-row">
            <label className="quantity-picker"><span className="sr-only">{t.cart.quantity}</span><button type="button" onClick={() => setQuantity((value) => Math.max(1, value - 1))}>−</button><output>{quantity}</output><button type="button" onClick={() => setQuantity((value) => value + 1)}>+</button></label>
            <button className="button button-dark add-button" onClick={handleAdd}>{added ? `✓ ${t.product.added}` : t.actions.add}</button>
          </div>
          {error && <p className="form-error" role="alert">{error}</p>}
          <div className="pickup-note"><span>⌂</span><p>{t.product.pickup}<small>19 W Market St · Salinas, CA</small></p></div>
        </div>
      </section>
      {related.length > 0 && <section className="section related-products"><div className="section-heading"><p className="eyebrow">Complete the look</p><h2>{t.product.related}</h2></div><div className="product-grid">{related.map((item) => <ProductCard key={item.id} product={item} />)}</div></section>}
    </div>
  )
}
