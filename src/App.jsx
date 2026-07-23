import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Layout from "./components/Layout"
import { CartProvider } from "./context/CartContext"
import { LanguageProvider } from "./context/LanguageContext"
import CartPage from "./pages/CartPage"
import CategoryPage from "./pages/CategoryPage"
import HomePage from "./pages/HomePage"
import NotFoundPage from "./pages/NotFoundPage"
import ProductPage from "./pages/ProductPage"

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "categoria/:slug", element: <CategoryPage /> },
      { path: "producto/:id", element: <ProductPage /> },
      { path: "carrito", element: <CartPage /> },
      { path: "404", element: <NotFoundPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
], { basename: import.meta.env.BASE_URL })

export default function App() {
  return <LanguageProvider><CartProvider><RouterProvider router={router} /></CartProvider></LanguageProvider>
}
