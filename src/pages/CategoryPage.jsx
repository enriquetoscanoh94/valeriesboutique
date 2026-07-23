import { useMemo, useState } from "react"
import { Link, Navigate, useParams } from "react-router-dom"
import ProductCard from "../components/ProductCard"
import { useLanguage } from "../context/LanguageContext"
import { categories, getCategory, getProductsByCategory } from "../data/catalog"

export default function CategoryPage() {
  const { slug } = useParams()
  const category = getCategory(slug)
  const { localize, t } = useLanguage()
  const [sort, setSort] = useState("featured")
  const categoryProducts = getProductsByCategory(slug)
  const sortedProducts = useMemo(() => {
    const result = [...categoryProducts]
    if (sort === "low") result.sort((a, b) => a.price - b.price)
    if (sort === "high") result.sort((a, b) => b.price - a.price)
    if (sort === "featured") result.sort((a, b) => Number(b.featured) - Number(a.featured))
    return result
  }, [categoryProducts, sort])

  if (!category) return <Navigate to="/404" replace />
  return (
    <div className="catalog-page">
      <header className="catalog-hero">
        <p className="eyebrow">{t.catalog.eyebrow}</p>
        <h1>{localize(category.name)}</h1>
        <p>{localize(category.description)}</p>
        <div className="subcategory-list">{localize(category.subcategories).map((item) => <span key={item}>{item}</span>)}</div>
      </header>
      <div className="category-tabs" aria-label={t.home.categories}>{categories.map((item) => <Link key={item.slug} className={item.slug === slug ? "active" : ""} to={`/categoria/${item.slug}`}>{localize(item.name)}</Link>)}</div>
      <section className="section catalog-content">
        <div className="catalog-toolbar">
          <p>{sortedProducts.length} {t.catalog.results}</p>
          <label><span>{t.catalog.sort}</span><select value={sort} onChange={(event) => setSort(event.target.value)}><option value="featured">{t.catalog.featured}</option><option value="low">{t.catalog.priceLow}</option><option value="high">{t.catalog.priceHigh}</option></select></label>
        </div>
        {sortedProducts.length > 0 ? <div className="product-grid catalog-grid">{sortedProducts.map((product) => <ProductCard key={product.id} product={product} />)}</div> : <div className="empty-state"><h2>{t.catalog.empty}</h2><Link className="button button-dark" to="/">{t.actions.back}</Link></div>}
      </section>
    </div>
  )
}
