import { Link } from "react-router-dom"
import { useLanguage } from "../context/LanguageContext"
import { WhatsAppIcon } from "./Icons"

export default function Footer() {
  const { t } = useLanguage()
  return (
    <>
      <footer className="site-footer">
        <div className="footer-grid">
          <div>
            <Link to="/"><img src={`${import.meta.env.BASE_URL}logo-letrero.png`} alt="Valerie's Boutique" className="footer-logo" /></Link>
            <p className="muted">{t.footer.secure}</p>
          </div>
          <div>
            <h2>{t.footer.visit}</h2>
            <address>19 W Market St<br />Salinas, CA 93901</address>
            <a href="tel:+18319980610">(831) 998-0610</a>
          </div>
          <div>
            <h2>{t.footer.hours}</h2>
            <p className="muted">{t.footer.schedule}</p>
            <Link to="/visita-citas">{t.actions.policies}</Link>
            <div className="social-links">
              <a href="https://www.instagram.com/valeries._boutique_/" target="_blank" rel="noreferrer">Instagram</a>
              <a href="https://www.tiktok.com/@valeries..boutique" target="_blank" rel="noreferrer">TikTok</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">© {new Date().getFullYear()} Valerie&apos;s Boutique · Salinas, CA</div>
      </footer>
      <a href="https://wa.me/18319980610" target="_blank" rel="noreferrer" className="whatsapp" aria-label="WhatsApp"><WhatsAppIcon /></a>
    </>
  )
}
