import { useState } from "react"
import { Link } from "react-router-dom"
import { useCart } from "../context/CartContext"
import { useLanguage } from "../context/LanguageContext"
import { useProducts } from "../context/ProductsContext"
import { imageUrl } from "../data/catalog"
import { usStates } from "../data/usStates"

const EMPTY_FORM = {
  name: "", email: "", phone: "",
  method: "pickup",
  address: "", address2: "", city: "", state: "", zip: "",
  eventType: "", eventDate: "", notes: "",
}

export default function CheckoutPage() {
  const { items } = useCart()
  const { localize, t } = useLanguage()
  const { getProduct } = useProducts()

  const [form, setForm] = useState(EMPTY_FORM)
  const [error, setError] = useState("")
  const [processing, setProcessing] = useState(false)
  const [shipping, setShipping] = useState(null) // { amount, service }
  const [shippingLoading, setShippingLoading] = useState(false)

  // Une cada item del carrito con su producto real del catalogo
  const lines = items
    .map((item) => ({ ...item, product: getProduct(item.productId) }))
    .filter((item) => item.product)
  const subtotal = lines.reduce((total, item) => total + item.product.price * item.quantity, 0)
  const shippingCost = form.method === "shipping" && shipping ? shipping.amount : 0
  const total = subtotal + shippingCost

  const colorName = (product, value) => localize(product.colors.find((color) => color.value === value)?.name)

  const setField = (event) => {
    const { name, value } = event.target
    // Si cambia el metodo o la direccion, hay que recalcular el envio.
    if (name === "method" || name === "zip") setShipping(null)
    setForm({ ...form, [name]: value })
  }

  // Cotiza el envio USPS para el ZIP escrito.
  const calcShipping = async () => {
    if (!form.zip.trim()) return
    setError("")
    setShippingLoading(true)
    try {
      const response = await fetch("/api/shipping", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          zip: form.zip.trim(),
          items: items.map((item) => ({ productId: item.productId, quantity: item.quantity })),
        }),
      })
      const data = await response.json()
      setShipping(data.amount != null ? data : { amount: null })
    } catch {
      setShipping({ amount: null })
    } finally {
      setShippingLoading(false)
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    // Campos obligatorios: nombre y telefono siempre; si es envio, tambien la direccion
    const requiredOk = form.name.trim() && form.phone.trim() &&
      (form.method === "pickup" || (form.address.trim() && form.city.trim() && form.state.trim() && form.zip.trim()))
    if (!requiredOk) {
      setError(t.checkout.required)
      return
    }

    // Pide al servidor una sesion de pago de Stripe y redirige a la pagina de pago.
    setError("")
    setProcessing(true)
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({ productId: item.productId, quantity: item.quantity })),
          customer: form,
        }),
      })
      const data = await response.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        setError(data.error || t.checkout.required)
        setProcessing(false)
      }
    } catch {
      setError(t.checkout.payError)
      setProcessing(false)
    }
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
                <div className="field">
                  <label htmlFor="state">{t.checkout.state} *</label>
                  <select id="state" name="state" value={form.state} onChange={setField}>
                    <option value="">—</option>
                    {usStates.map((state) => <option key={state.code} value={state.code}>{state.name}</option>)}
                  </select>
                </div>
                <div className="field"><label htmlFor="zip">{t.checkout.zip} *</label><input id="zip" name="zip" inputMode="numeric" value={form.zip} onChange={setField} /></div>
              </div>
              <button type="button" className="button button-outline calc-shipping" onClick={calcShipping} disabled={shippingLoading || !form.zip.trim()}>
                {shippingLoading ? t.checkout.calculating : t.checkout.calcShipping}
              </button>
              {shipping && shipping.amount === null && <p className="form-error">{t.checkout.shippingUnavailable}</p>}
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
          <button className="button button-dark" type="submit" disabled={processing}>{processing ? t.checkout.redirecting : t.checkout.place}</button>
        </form>

        <aside className="cart-summary checkout-summary">
          <h2>{t.checkout.summary}</h2>
          <ul className="checkout-summary-lines">
            {lines.map((item) => (
              <li key={item.key}>
                <img src={imageUrl(item.product.images[0])} alt={localize(item.product.name)} />
                <span className="summary-line-name">{localize(item.product.name)}<small>
                  {item.size && `${t.cart.size}: ${item.size}`}{item.size && item.color && " · "}{item.color && `${t.cart.color}: ${colorName(item.product, item.color)}`}{" · × "}{item.quantity}
                </small></span>
                <span className="summary-line-price">${(item.product.price * item.quantity).toFixed(2)}</span>
              </li>
            ))}
          </ul>
          <div><span>{t.checkout.subtotal}</span><strong>${subtotal.toFixed(2)}</strong></div>
          <div>
            <span>{t.checkout.shippingLabel}</span>
            <strong>
              {form.method === "pickup"
                ? t.checkout.shippingPickup
                : shipping && shipping.amount != null
                  ? `$${shipping.amount.toFixed(2)}`
                  : t.checkout.shippingCalc}
            </strong>
          </div>
          {shipping && shipping.amount != null && shipping.service && <p className="recap-meta">USPS · {shipping.service}</p>}
          <div className="summary-total"><span>Total</span><strong>${total.toFixed(2)}</strong></div>
          <p>{t.cart.note}</p>
          <Link className="continue-link" to="/carrito">← {t.actions.back}</Link>
        </aside>
      </div>
    </div>
  )
}
