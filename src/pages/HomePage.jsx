import { Link } from "react-router-dom"
import ProductCard from "../components/ProductCard"
import { useLanguage } from "../context/LanguageContext"
import { categories, products } from "../data/catalog"

const opinions = [
  { author: "Mariana G.", es: "Hermoso vestido y excelente atención. ¡Mi XV quedó perfecta!", en: "Beautiful dress and amazing service. My quince was perfect!" },
  { author: "Jocelyn R.", es: "Encontré el vestido de novia de mis sueños.", en: "I found my dream wedding gown." },
  { author: "Alejandra M.", es: "Todo coordinado y precioso para nuestro evento.", en: "Everything matched beautifully for our event." },
]

export default function HomePage() {
  const { language, localize, t } = useLanguage()
  const featured = products.filter((product) => product.featured)
  const rest = products.filter((product) => !product.featured)
  const asset = (path) => `${import.meta.env.BASE_URL}${path}`
  const categoryImage = (category) => category.coverImage || products.find((product) => product.category === category.slug)?.images[0]

  return (
    <>
      <section className="hero">
        <div className="hero-glow" />
        <img src={asset("flores/rama-botones.webp")} alt="" className="hero-flower branch" />
        <img src={asset("flores/ramo-derecha.webp")} alt="" className="hero-flower bouquet-right" />
        <img src={asset("flores/ramo-izquierda.webp")} alt="" className="hero-flower bouquet-left" />
        <img src={asset("flores/petalos.webp")} alt="" className="hero-flower petals" />
        <img src={asset("flores/rosa-grande.webp")} alt="" className="hero-flower rose" />
        <div className="hero-scrim" />
        <div className="hero-content">
          <p className="hero-kicker">{t.home.kicker}</p>
          <h1><span>{t.home.title1}</span><span>{t.home.title2}</span></h1>
          <p className="hero-intro">{t.home.intro}</p>
          <div className="hero-actions">
            <Link className="button button-primary" to="/categoria/xv">{t.home.primary}</Link>
            <Link className="button button-ghost" to="/categoria/accesorios">{t.home.secondary}</Link>
          </div>
        </div>
        <div className="scroll-line" />
      </section>

      <section className="section category-section">
        <div className="section-heading"><p className="eyebrow">Valerie&apos;s Boutique</p><h2>{t.home.categories}</h2></div>
        <div className="category-links">
          {categories.map((category) => (
            <Link key={category.slug} to={`/categoria/${category.slug}`}>
              <img src={asset(categoryImage(category))} alt="" loading="lazy" />
              <span>{localize(category.name)}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="section section-tint">
        <div className="section-heading"><p className="eyebrow">The signature edit</p><h2>{t.home.featured}</h2></div>
        <div className="featured-grid">{featured.map((product) => <ProductCard key={product.id} product={product} large />)}</div>
      </section>

      <section className="section">
        <div className="section-heading"><p className="eyebrow">Curated for every detail</p><h2>{t.home.more}</h2></div>
        <div className="product-grid">{rest.map((product) => <ProductCard key={product.id} product={product} />)}</div>
      </section>

      <section className="story-section">
        <div className="story-art"><img src={asset("flores/ramo-izquierda.webp")} alt="" loading="lazy" /></div>
        <div className="story-copy">
          <p className="eyebrow">19 W Market St · Salinas</p>
          <h2>{t.home.storyTitle}</h2><p>{t.home.story}</p>
          <a className="text-link" href="https://maps.google.com/?q=19+W+Market+St+Salinas+CA+93901" target="_blank" rel="noreferrer">{t.home.directions} →</a>
        </div>
      </section>

      <section className="section service-section">
        <div className="section-heading"><p className="eyebrow">Online & in store</p><h2>{t.home.serviceTitle}</h2></div>
        <div className="service-grid">
          <article><span>01</span><h3>{t.home.onlineTitle}</h3><p>{t.home.onlineText}</p><Link className="text-link" to="/categoria/xv">{t.actions.continue} →</Link></article>
          <article><span>02</span><h3>{t.home.storeTitle}</h3><p>{t.home.storeText}</p><Link className="text-link" to="/visita-citas">{t.actions.policies} →</Link></article>
        </div>
      </section>

      <section className="section">
        <div className="package-panel">
          <img src={asset("flores/rama-botones.webp")} alt="" loading="lazy" />
          <div><p className="eyebrow">Styled together</p><h2>{t.home.packageTitle}</h2><p>{t.home.packageText}</p><Link className="button button-light" to="/categoria/accesorios">{t.home.packageButton}</Link></div>
        </div>
      </section>

      <section className="section section-tint testimonials">
        <div className="section-heading"><p className="eyebrow">Client love</p><h2>{language === "es" ? "Lo que dicen nuestras clientas" : "What our clients say"}</h2></div>
        <div className="testimonial-grid">
          {opinions.map((opinion) => <figure key={opinion.author}><div className="stars" aria-label="5 estrellas">★★★★★</div><blockquote>“{opinion[language]}”</blockquote><figcaption>— {opinion.author}</figcaption></figure>)}
        </div>
      </section>
    </>
  )
}
