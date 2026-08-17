import { useEffect } from "react"
import { Link } from "react-router-dom"
import { useCart } from "../context/CartContext"
import { useLanguage } from "../context/LanguageContext"

export default function PagoExitosoPage() {
  const { clearCart } = useCart()
  const { t } = useLanguage()

  // El pago ya se completo en Stripe: vaciamos el carrito.
  useEffect(() => {
    clearCart()
    window.scrollTo(0, 0)
  }, [clearCart])

  return (
    <div className="checkout-page section">
      <div className="checkout-success">
        <div className="success-mark">
          <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="#b76e79" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
        </div>
        <p className="eyebrow">Valerie&apos;s Boutique</p>
        <h1>{t.checkout.paidTitle}</h1>
        <p className="success-text">{t.checkout.paidText}</p>
        <Link className="button button-dark" to="/">{t.checkout.backHome}</Link>
      </div>
    </div>
  )
}
