import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { collection, onSnapshot, orderBy, query } from "firebase/firestore"
import { db } from "../firebase"
import { useProducts } from "../context/ProductsContext"

export default function AdminResumenPage() {
  const { products } = useProducts()
  const [orders, setOrders] = useState([])

  useEffect(() => {
    const ordersQuery = query(collection(db, "orders"), orderBy("createdAt", "desc"))
    const unsubscribe = onSnapshot(ordersQuery, (snapshot) => {
      setOrders(snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() })))
    }, () => {})
    return unsubscribe
  }, [])

  const now = new Date()
  const thisMonth = orders.filter((order) => {
    const date = new Date(order.createdAt)
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
  })
  const salesMonth = thisMonth.reduce((total, order) => total + Number(order.amountTotal || 0), 0)
  const toShip = orders.filter((order) => order.shippingStatus === "por-enviar").length

  return (
    <>
      <h2 className="admin-section-title">Resumen</h2>
      <p className="admin-sub">Un vistazo rápido de tu tienda.</p>

      <div className="admin-stats">
        <div className="stat-card">
          <p className="stat-value">${salesMonth.toFixed(2)}</p>
          <p className="stat-label">Ventas este mes</p>
        </div>
        <Link to="/admin/pedidos" className="stat-card stat-link">
          <p className="stat-value">{toShip}</p>
          <p className="stat-label">Pedidos por enviar</p>
        </Link>
        <Link to="/admin/productos" className="stat-card stat-link">
          <p className="stat-value">{products.length}</p>
          <p className="stat-label">Productos en la tienda</p>
        </Link>
      </div>
    </>
  )
}
