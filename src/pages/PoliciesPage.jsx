import { useLanguage } from "../context/LanguageContext"

export default function PoliciesPage() {
  const { t } = useLanguage()
  const policy = t.policies
  return (
    <div className="policies-page">
      <header className="catalog-hero"><p className="eyebrow">{policy.eyebrow}</p><h1>{policy.title}</h1></header>
      <section className="section policy-grid">
        <article><span>01</span><h2>{policy.onlineTitle}</h2><p>{policy.onlineText}</p></article>
        <article><span>02</span><h2>{policy.browseTitle}</h2><p>{policy.browseText}</p></article>
        <article><span>03</span><h2>{policy.fittingTitle}</h2><p>{policy.fittingText}</p></article>
        <article><span>04</span><h2>{policy.feeTitle}</h2><p>{policy.feeText}</p></article>
      </section>
      <section className="appointment-panel">
        <div><p className="eyebrow">{policy.notesTitle}</p><ul>{policy.notes.map((note) => <li key={note}>{note}</li>)}</ul><small>{policy.source}</small></div>
        <a className="button button-primary" href="https://www.instagram.com/valeries._boutique_/" target="_blank" rel="noreferrer">{t.actions.appointment}</a>
      </section>
    </div>
  )
}
