import { Link } from "react-router-dom"
import { useCart } from "../context/CartContext"
import { useLanguage } from "../context/LanguageContext"
import { getProduct } from "../data/catalog"

export default function CartPage() {
  const { items, itemCount, removeItem, updateQuantity } = useCart()
  const { localize, t } = useLanguage()
  const lines = items.map((item) => ({ ...item, product: getProduct(item.productId) })).filter((item) => item.product)
  const subtotal = lines.reduce((total, item) => total + item.product.price * item.quantity, 0)
  const colorName = (product, value) => localize(product.colors.find((color) => color.value === value)?.name)
  return (
    <div className="cart-page section">
      <header className="cart-heading"><p className="eyebrow">Valerie&apos;s Boutique</p><h1>{t.cart.title}</h1><p>{itemCount} {itemCount === 1 ? t.cart.item : t.cart.items}</p></header>
      {lines.length === 0 ? <div className="empty-cart"><div className="empty-cart-mark">VB</div><h2>{t.cart.empty}</h2><Link className="button button-dark" to="/categoria/xv">{t.actions.continue}</Link></div> : (
        <div className="cart-layout">
          <div className="cart-lines">{lines.map((item) => (
            <article className="cart-line" key={item.key}>
              <Link to={`/producto/${item.product.id}`}><img src={`${import.meta.env.BASE_URL}${item.product.images[0]}`} alt={localize(item.product.name)} /></Link>
              <div className="cart-line-info"><h2><Link to={`/producto/${item.product.id}`}>{localize(item.product.name)}</Link></h2><p>{item.size && `${t.cart.size}: ${item.size}`}{item.size && item.color && " · "}{item.color && `${t.cart.color}: ${colorName(item.product, item.color)}`}</p>
                <div className="cart-line-actions"><div className="quantity-picker compact"><button type="button" onClick={() => updateQuantity(item.key, item.quantity - 1)} disabled={item.quantity === 1}>−</button><output>{item.quantity}</output><button type="button" onClick={() => updateQuantity(item.key, item.quantity + 1)}>+</button></div><button className="remove-button" onClick={() => removeItem(item.key)}>{t.actions.remove}</button></div>
              </div><p className="cart-line-price">${(item.product.price * item.quantity).toFixed(2)}</p>
            </article>
          ))}</div>
          <aside className="cart-summary"><h2>{t.cart.total}</h2><div><span>{t.cart.subtotal}</span><strong>${subtotal.toFixed(2)}</strong></div><div><span>{t.cart.pickup}</span><strong>$0.00</strong></div><div className="summary-total"><span>Total</span><strong>${subtotal.toFixed(2)}</strong></div><p>{t.cart.note}</p><button className="button button-dark" disabled>{t.actions.checkout} · Próximamente</button><Link className="continue-link" to="/categoria/xv">← {t.actions.continue}</Link></aside>
        </div>
      )}
    </div>
  )
}
