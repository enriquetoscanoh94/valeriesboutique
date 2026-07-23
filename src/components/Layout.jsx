import { Outlet, ScrollRestoration } from "react-router-dom"
import Header from "./Header"
import Footer from "./Footer"

export default function Layout() {
  return (
    <div className="app-shell">
      <Header />
      <main><Outlet /></main>
      <Footer />
      <ScrollRestoration />
    </div>
  )
}
