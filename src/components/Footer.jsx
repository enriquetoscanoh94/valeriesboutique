import { Link } from "react-router-dom"
import { useLanguage } from "../context/LanguageContext"
import { business } from "../data/business"
import { WhatsAppIcon } from "./Icons"

export default function Footer() {
  const { t } = useLanguage()
  return (
    <>
      <footer className="site-footer">
        <div className="footer-grid">
          <div>
            <Link to="/"><img src={`${import.meta.env.BASE_URL}logo-letrero.png`} alt={business.name} className="footer-logo" /></Link>
            <p className="muted">{t.footer.secure}</p>
          </div>
          <div>
            <h2>{t.footer.visit}</h2>
            <address>{business.street}<br />{business.city}, {business.state} {business.zip}</address>
            <a href={business.phoneLink}>{business.phoneDisplay}</a>
          </div>
          <div>
            <h2>{t.footer.hours}</h2>
            <p className="muted">{t.footer.schedule}</p>
            <Link to="/visita-citas">{t.actions.policies}</Link>
            <div className="social-links">
              <a href={business.instagram} target="_blank" rel="noreferrer">Instagram</a>
              <a href={business.tiktok} target="_blank" rel="noreferrer">TikTok</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">© {new Date().getFullYear()} {business.name} · {business.city}, {business.state}</div>
      </footer>
      <a href={`https://wa.me/${business.whatsapp}`} target="_blank" rel="noreferrer" className="whatsapp" aria-label="WhatsApp"><WhatsAppIcon /></a>
    </>
  )
}
