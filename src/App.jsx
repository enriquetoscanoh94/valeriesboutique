import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Layout from "./components/Layout"
import { AuthProvider } from "./context/AuthContext"
import { CartProvider } from "./context/CartContext"
import { LanguageProvider } from "./context/LanguageContext"
import { ProductsProvider } from "./context/ProductsContext"
import AccountPage from "./pages/AccountPage"
import AdminPage from "./pages/AdminPage"
import CartPage from "./pages/CartPage"
import CategoryPage from "./pages/CategoryPage"
import CheckoutPage from "./pages/CheckoutPage"
import HomePage from "./pages/HomePage"
import NotFoundPage from "./pages/NotFoundPage"
import ProductPage from "./pages/ProductPage"
import PoliciesPage from "./pages/PoliciesPage"

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
      { path: "cuenta", element: <AccountPage /> },
      { path: "admin", element: <AdminPage /> },
      { path: "visita-citas", element: <PoliciesPage /> },
      { path: "404", element: <NotFoundPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
], { basename: import.meta.env.BASE_URL })

export default function App() {
  return <LanguageProvider><AuthProvider><ProductsProvider><CartProvider><RouterProvider router={router} /></CartProvider></ProductsProvider></AuthProvider></LanguageProvider>
}
