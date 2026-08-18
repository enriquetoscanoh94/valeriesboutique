import { lazy, Suspense } from "react"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Layout from "./components/Layout"
import { AuthProvider } from "./context/AuthContext"
import { CartProvider } from "./context/CartContext"
import { LanguageProvider } from "./context/LanguageContext"
import { ProductsProvider } from "./context/ProductsContext"
import AccountPage from "./pages/AccountPage"
import CartPage from "./pages/CartPage"
import CategoryPage from "./pages/CategoryPage"
import CheckoutPage from "./pages/CheckoutPage"
import HomePage from "./pages/HomePage"
import NotFoundPage from "./pages/NotFoundPage"
import PagoExitosoPage from "./pages/PagoExitosoPage"
import ProductPage from "./pages/ProductPage"
import PoliciesPage from "./pages/PoliciesPage"

// El panel de administracion se carga solo cuando la admin entra:
// un cliente que solo compra no descarga este codigo.
const AdminLayout = lazy(() => import("./pages/AdminLayout"))
const AdminPage = lazy(() => import("./pages/AdminPage"))
const AdminOrdersPage = lazy(() => import("./pages/AdminOrdersPage"))
const AdminResumenPage = lazy(() => import("./pages/AdminResumenPage"))

const adminLoading = <div className="section"><p>Cargando…</p></div>

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "categoria/:slug", element: <CategoryPage /> },
      { path: "producto/:id", element: <ProductPage /> },
      { path: "carrito", element: <CartPage /> },
      { path: "checkout", element: <CheckoutPage /> },
      { path: "pago-exitoso", element: <PagoExitosoPage /> },
      { path: "cuenta", element: <AccountPage /> },
      {
        path: "admin",
        element: <Suspense fallback={adminLoading}><AdminLayout /></Suspense>,
        children: [
          { index: true, element: <AdminResumenPage /> },
          { path: "productos", element: <AdminPage /> },
          { path: "pedidos", element: <AdminOrdersPage /> },
        ],
      },
      { path: "visita-citas", element: <PoliciesPage /> },
      { path: "404", element: <NotFoundPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
], { basename: import.meta.env.BASE_URL })

export default function App() {
  return <LanguageProvider><AuthProvider><ProductsProvider><CartProvider><RouterProvider router={router} /></CartProvider></ProductsProvider></AuthProvider></LanguageProvider>
}
