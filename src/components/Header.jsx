import { useEffect, useState } from "react"
import { Link, NavLink, useLocation } from "react-router-dom"
import { useCart } from "../context/CartContext"
import { useLanguage } from "../context/LanguageContext"
import { BagIcon, CloseIcon, MenuIcon, SearchIcon } from "./Icons"

export default function Header() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const { itemCount } = useCart()
  const { language, toggleLanguage, t } = useLanguage()

  useEffect(() => setOpen(false), [pathname])
  useEffect(() => {
    document.body.classList.toggle("menu-open", open)
    return () => document.body.classList.remove("menu-open")
  }, [open])

  const links = [
    ["/categoria/xv", t.nav.quince],
    ["/categoria/novias", t.nav.bridal],
    ["/categoria/nina", t.nav.girls],
    ["/categoria/ramos", t.nav.bouquets],
    ["/categoria/accesorios", t.nav.accessories],
  ]

  return (
    <>
      <div className="announcement">{t.announcement}</div>
      <header className="site-header">
        <div className="header-inner">
          <button className="icon-button mobile-only" onClick={() => setOpen(true)} aria-label={t.actions.menu} aria-expanded={open}>
            <MenuIcon />
          </button>
          <Link to="/" className="brand-link" aria-label="Valerie's Boutique">
            <img src={`${import.meta.env.BASE_URL}logo-letrero.png`} alt="Valerie's Boutique" />
          </Link>
          <nav className="desktop-nav" aria-label="Principal">
            {links.map(([to, label]) => <NavLink key={to} to={to}>{label}</NavLink>)}
          </nav>
          <div className="header-actions">
            <button className="language-button" onClick={toggleLanguage} aria-label={language === "es" ? "Switch to English" : "Cambiar a español"}>
              {language === "es" ? "EN" : "ES"}
            </button>
            <Link to="/categoria/xv" className="icon-button desktop-only" aria-label={t.actions.search}><SearchIcon /></Link>
            <Link to="/carrito" className="icon-button cart-link" aria-label={`${t.actions.cart}: ${itemCount}`}>
              <BagIcon />
              {itemCount > 0 && <span className="cart-count">{itemCount}</span>}
            </Link>
          </div>
        </div>
      </header>
      <div className={`mobile-menu-backdrop ${open ? "is-open" : ""}`} onClick={() => setOpen(false)} aria-hidden="true" />
      <aside className={`mobile-menu ${open ? "is-open" : ""}`} aria-hidden={!open}>
        <div className="mobile-menu-top">
          <span className="mobile-menu-title">Valerie&apos;s</span>
          <button className="icon-button" onClick={() => setOpen(false)} aria-label={t.actions.close}><CloseIcon /></button>
        </div>
        <nav aria-label="Móvil">
          <NavLink to="/">{t.nav.home}</NavLink>
          {links.map(([to, label]) => <NavLink key={to} to={to}>{label}</NavLink>)}
          <NavLink to="/carrito">{t.actions.cart} {itemCount > 0 && `(${itemCount})`}</NavLink>
        </nav>
        <div className="mobile-menu-contact">
          <p>19 W Market St · Salinas, CA</p>
          <a href="tel:+18319980610">(831) 998-0610</a>
        </div>
      </aside>
    </>
  )
}
