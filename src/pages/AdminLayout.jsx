import { NavLink, Navigate, Outlet } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

// Marco comun del panel: encabezado + pestañas + proteccion de admin.
// La verificacion de "es admin" vive SOLO aqui (no se repite en cada seccion).
export default function AdminLayout() {
  const { user, loading, isAdmin, logout } = useAuth()

  if (loading) return <div className="section"><p>Cargando…</p></div>
  if (!user || !isAdmin) return <Navigate to="/cuenta" replace />

  return (
    <div className="admin-shell section">
      <header className="admin-shell-top">
        <div>
          <p className="eyebrow">Panel de administración</p>
          <h1 className="admin-shell-title">Valerie&apos;s Boutique</h1>
        </div>
        <div className="admin-shell-user">
          <span>{user.displayName || user.email}</span>
          <button className="account-logout" onClick={() => logout()}>Cerrar sesión</button>
        </div>
      </header>

      <nav className="admin-tabs" aria-label="Secciones del panel">
        <NavLink to="/admin" end>Resumen</NavLink>
        <NavLink to="/admin/productos">Productos</NavLink>
        <NavLink to="/admin/pedidos">Pedidos</NavLink>
      </nav>

      <div className="admin-content">
        <Outlet />
      </div>
    </div>
  )
}
