import { useState } from "react"
import { Link } from "react-router-dom"
import { useCart } from "../context/CartContext"
import { useLanguage } from "../context/LanguageContext"
import { getProduct } from "../data/catalog"

const EMPTY_FORM = {
  name: "", email: "", phone: "",
  method: "pickup",
  address: "", address2: "", city: "", state: "", zip: "",
  eventType: "", eventDate: "", notes: "",
}

export default function CheckoutPage() {
  const { items, clearCart } = useCart()
  const { localize, t } = useLanguage()

  const [form, setForm] = useState(EMPTY_FORM)
  const [error, setError] = useState("")
  const [placedOrder, setPlacedOrder] = useState(null)

  // Une cada item del carrito con su producto real del catalogo
  const lines = items
    .map((item) => ({ ...item, product: getProduct(item.productId) }))
    .filter((item) => item.product)
  const subtotal = lines.reduce((total, item) => total + item.product.price * item.quantity, 0)

  const colorName = (product, value) => localize(product.colors.find((color) => color.value === value)?.name)
  const setField = (event) => setForm({ ...form, [event.target.name]: event.target.value })

  const handleSubmit = (event) => {
    event.preventDefault()
    // Campos obligatorios: nombre y telefono siempre; si es envio, tambien la direccion
    const requiredOk = form.name.trim() && form.phone.trim() &&
      (form.method === "pickup" || (form.address.trim() && form.city.trim() && form.state.trim() && form.zip.trim()))
    if (!requiredOk) {
      setError(t.checkout.required)
      return
    }

    // Arma el pedido (snapshot para la confirmacion) y lo guarda localmente.
    // Aun NO hay cobro: cuando entre Stripe, aqui se hara el redirect al pago.
    const order = {
      reference: `VB-${Date.now().toString().slice(-6)}`,
      customer: form,
      lines: lines.map((item) => ({
        name: localize(item.product.name),
        quantity: item.quantity,
        price: item.product.price,
        image: item.product.images[0],
      })),
      subtotal,
      date: new Date().toISOString(),
    }
    localStorage.setItem("valeries-last-order", JSON.stringify(order))
    clearCart()
    setPlacedOrder(order)
    setError("")
    window.scrollTo(0, 0)
  }

  // 1) Confirmacion (despues de enviar el pedido)
  if (placedOrder) {
    return (
      <div className="checkout-page section">
        <div className="checkout-success">
          <div className="success-mark">
            <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="#b76e79" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
          </div>
          <p className="eyebrow">Valerie&apos;s Boutique</p>
          <h1>{t.checkout.successTitle}</h1>
          <p className="success-text">{t.checkout.successText}</p>

          <div className="order-recap">
            <h2>{t.checkout.summary}</h2>
            <ul>
              {placedOrder.lines.map((line, index) => (
                <li key={index}><span>{line.name} × {line.quantity}</span><span>${(line.price * line.quantity).toFixed(2)}</span></li>
              ))}
            </ul>
            <div className="order-recap-row recap-total"><span>{t.checkout.subtotal}</span><span>${placedOrder.subtotal.toFixed(2)}</span></div>
            <p className="recap-meta">{t.checkout.reference}: {placedOrder.reference}</p>
            <p className="recap-meta">{t.checkout.deliveryLabel}: {placedOrder.customer.method === "pickup" ? t.checkout.methodPickup : t.checkout.methodShipping}</p>
            <p className="recap-meta">{t.checkout.payNote}</p>
          </div>

          <Link className="button button-dark" to="/">{t.checkout.backHome}</Link>
        </div>
      </div>
    )
  }

  // 2) Carrito vacio
  if (lines.length === 0) {
    return (
      <div className="checkout-page section">
        <header className="checkout-heading"><p className="eyebrow">Valerie&apos;s Boutique</p><h1>{t.checkout.title}</h1></header>
        <div className="empty-cart">
          <div className="empty-cart-mark">VB</div>
          <h2>{t.checkout.empty}</h2>
          <Link className="button button-dark" to="/categoria/xv">{t.actions.continue}</Link>
        </div>
      </div>
    )
  }

  // 3) Formulario de checkout
  return (
    <div className="checkout-page section">
      <header className="checkout-heading"><p className="eyebrow">Valerie&apos;s Boutique</p><h1>{t.checkout.title}</h1></header>

      <div className="checkout-layout">
        <form className="checkout-form" onSubmit={handleSubmit} noValidate>
          <fieldset>
            <legend>{t.checkout.contact}</legend>
            <div className="field"><label htmlFor="name">{t.checkout.name} *</label><input id="name" name="name" value={form.name} onChange={setField} required /></div>
            <div className="field-row">
              <div className="field"><label htmlFor="phone">{t.checkout.phone} *</label><input id="phone" name="phone" type="tel" value={form.phone} onChange={setField} required /></div>
              <div className="field"><label htmlFor="email">{t.checkout.email}</label><input id="email" name="email" type="email" value={form.email} onChange={setField} /></div>
            </div>
          </fieldset>

          <fieldset>
            <legend>{t.checkout.method}</legend>
            <div className="method-options">
              <label className="method-option">
                <input type="radio" name="method" value="pickup" checked={form.method === "pickup"} onChange={setField} />
                <span><span className="method-title">{t.checkout.pickup}</span><span className="method-hint">{t.checkout.pickupHint}</span></span>
              </label>
              <label className="method-option">
                <input type="radio" name="method" value="shipping" checked={form.method === "shipping"} onChange={setField} />
                <span><span className="method-title">{t.checkout.shipping}</span><span className="method-hint">{t.checkout.shippingHint}</span></span>
              </label>
            </div>
          </fieldset>

          {form.method === "shipping" && (
            <fieldset>
              <legend>{t.checkout.addressTitle}</legend>
              <div className="field"><label htmlFor="address">{t.checkout.address} *</label><input id="address" name="address" value={form.address} onChange={setField} /></div>
              <div className="field"><label htmlFor="address2">{t.checkout.address2}</label><input id="address2" name="address2" value={form.address2} onChange={setField} /></div>
              <div className="field-row thirds">
                <div className="field"><label htmlFor="city">{t.checkout.city} *</label><input id="city" name="city" value={form.city} onChange={setField} /></div>
                <div className="field"><label htmlFor="state">{t.checkout.state} *</label><input id="state" name="state" value={form.state} onChange={setField} /></div>
                <div className="field"><label htmlFor="zip">{t.checkout.zip} *</label><input id="zip" name="zip" inputMode="numeric" value={form.zip} onChange={setField} /></div>
              </div>
            </fieldset>
          )}

          <fieldset>
            <legend>{t.checkout.eventTitle}</legend>
            <div className="field-row">
              <div className="field"><label htmlFor="eventType">{t.checkout.eventType}</label><input id="eventType" name="eventType" value={form.eventType} onChange={setField} /></div>
              <div className="field"><label htmlFor="eventDate">{t.checkout.eventDate}</label><input id="eventDate" name="eventDate" type="date" value={form.eventDate} onChange={setField} /></div>
            </div>
            <div className="field"><label htmlFor="notes">{t.checkout.notes}</label><textarea id="notes" name="notes" value={form.notes} onChange={setField} /></div>
          </fieldset>

          {error && <p className="form-error">{error}</p>}
          <button className="button button-dark" type="submit">{t.checkout.place}</button>
        </form>

        <aside className="cart-summary checkout-summary">
          <h2>{t.checkout.summary}</h2>
          <ul className="checkout-summary-lines">
            {lines.map((item) => (
              <li key={item.key}>
                <img src={`${import.meta.env.BASE_URL}${item.product.images[0]}`} alt={localize(item.product.name)} />
                <span className="summary-line-name">{localize(item.product.name)}<small>
                  {item.size && `${t.cart.size}: ${item.size}`}{item.size && item.color && " · "}{item.color && `${t.cart.color}: ${colorName(item.product, item.color)}`}{" · × "}{item.quantity}
                </small></span>
                <span className="summary-line-price">${(item.product.price * item.quantity).toFixed(2)}</span>
              </li>
            ))}
          </ul>
          <div><span>{t.checkout.subtotal}</span><strong>${subtotal.toFixed(2)}</strong></div>
          <div><span>{t.checkout.shippingLabel}</span><strong>{t.checkout.shippingTbd}</strong></div>
          <div className="summary-total"><span>Total</span><strong>${subtotal.toFixed(2)}*</strong></div>
          <p>{t.cart.note}</p>
          <Link className="continue-link" to="/carrito">← {t.actions.back}</Link>
        </aside>
      </div>
    </div>
  )
}
