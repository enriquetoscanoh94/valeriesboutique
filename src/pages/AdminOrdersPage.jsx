import { useEffect, useState } from "react"
import { Link, Navigate } from "react-router-dom"
import { collection, doc, onSnapshot, orderBy, query, updateDoc } from "firebase/firestore"
import { auth, db } from "../firebase"
import { useAuth } from "../context/AuthContext"

// Herramienta interna para la duena: en espanol.
export default function AdminOrdersPage() {
  const { user, loading, isAdmin } = useAuth()
  const [orders, setOrders] = useState([])
  const [ordersLoading, setOrdersLoading] = useState(true)
  const [busyId, setBusyId] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    if (!isAdmin) return
    const ordersQuery = query(collection(db, "orders"), orderBy("createdAt", "desc"))
    const unsubscribe = onSnapshot(ordersQuery, (snapshot) => {
      setOrders(snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() })))
      setOrdersLoading(false)
    }, () => setOrdersLoading(false))
    return unsubscribe
  }, [isAdmin])

  if (loading) return <div className="admin-page section"><p>Cargando…</p></div>
  if (!user || !isAdmin) return <Navigate to="/cuenta" replace />

  // Compra la etiqueta USPS del pedido y guarda el PDF + tracking.
  const buyLabel = async (order) => {
    setError("")
    setBusyId(order.id)
    try {
      const token = await auth.currentUser.getIdToken()
      const response = await fetch("/api/buy-label", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ to: order.customer, weightOz: order.weightOz }),
      })
      const data = await response.json()
      if (data.labelUrl) {
        await updateDoc(doc(db, "orders", order.id), {
          labelUrl: data.labelUrl,
          tracking: data.tracking || "",
          shippingStatus: "enviado",
        })
        window.open(data.labelUrl, "_blank") // abre el PDF para imprimir
      } else {
        setError(data.error || "No se pudo comprar la etiqueta.")
      }
    } catch {
      setError("No se pudo conectar. Intenta de nuevo.")
    } finally {
      setBusyId("")
    }
  }

  const fmtDate = (iso) => {
    try { return new Date(iso).toLocaleString("es-MX", { dateStyle: "medium", timeStyle: "short" }) }
    catch { return iso }
  }

  return (
    <div className="admin-page section">
      <header className="admin-heading">
        <p className="eyebrow">Panel de administración</p>
        <h1>Pedidos</h1>
        <p className="admin-sub">Aquí ves las ventas pagadas. Para las de envío, compra e imprime la etiqueta USPS con un clic.</p>
        <Link className="continue-link" to="/admin">← Volver a productos</Link>
      </header>

      {error && <p className="form-error">{error}</p>}

      {ordersLoading ? (
        <p>Cargando pedidos…</p>
      ) : orders.length === 0 ? (
        <p className="admin-empty">Aún no hay pedidos pagados. Cuando alguien compre, aparecerán aquí.</p>
      ) : (
        <div className="orders-list">
          {orders.map((order) => {
            const isShipping = order.customer?.method === "shipping"
            const hasLabel = Boolean(order.labelUrl)
            return (
              <article className="order-card" key={order.id}>
                <div className="order-top">
                  <div>
                    <p className="order-ref">{order.reference}</p>
                    <p className="order-date">{fmtDate(order.createdAt)}</p>
                  </div>
                  <div className="order-badges">
                    <span className="order-badge paid">Pagado ${Number(order.amountTotal).toFixed(2)}</span>
                    <span className={`order-badge ${order.shippingStatus === "enviado" ? "sent" : isShipping ? "topack" : "pickup"}`}>
                      {isShipping ? (order.shippingStatus === "enviado" ? "Enviado" : "Por enviar") : "Recoger en tienda"}
                    </span>
                  </div>
                </div>

                <div className="order-body">
                  <div className="order-customer">
                    <p><strong>{order.customer?.name}</strong></p>
                    {order.customer?.phone && <p>{order.customer.phone}</p>}
                    {order.customer?.email && <p>{order.customer.email}</p>}
                    {isShipping && (
                      <p className="order-address">
                        {[order.customer.street, order.customer.address2, order.customer.city, order.customer.state, order.customer.zip].filter(Boolean).join(", ")}
                      </p>
                    )}
                  </div>
                  <ul className="order-lines">
                    {(order.lines || []).map((line, index) => (
                      <li key={index}><span>{line.name} × {line.quantity}</span><span>${Number(line.amount).toFixed(2)}</span></li>
                    ))}
                  </ul>
                </div>

                {isShipping && (
                  <div className="order-actions">
                    {hasLabel ? (
                      <>
                        <a className="button button-dark" href={order.labelUrl} target="_blank" rel="noreferrer">Imprimir etiqueta</a>
                        {order.tracking && <span className="order-tracking">Rastreo: {order.tracking}</span>}
                      </>
                    ) : (
                      <button className="button button-dark" onClick={() => buyLabel(order)} disabled={busyId === order.id}>
                        {busyId === order.id ? "Comprando…" : "Comprar e imprimir etiqueta"}
                      </button>
                    )}
                  </div>
                )}
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}
