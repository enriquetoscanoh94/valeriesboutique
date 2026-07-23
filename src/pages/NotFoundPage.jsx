import { Link } from "react-router-dom"
import { useLanguage } from "../context/LanguageContext"

export default function NotFoundPage() {
  const { t } = useLanguage()
  return <section className="not-found"><p className="eyebrow">404</p><h1>{t.notFound.title}</h1><p>{t.notFound.text}</p><Link className="button button-dark" to="/">{t.nav.home}</Link></section>
}
