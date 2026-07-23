import { useEffect, useMemo, useState } from "react"
import { Navigate, useParams } from "react-router-dom"
import ProductCard from "../components/ProductCard"
import { useLanguage } from "../context/LanguageContext"
import { getCategory, getProductsByCategory } from "../data/catalog"

export default function CategoryPage() {
  const { slug } = useParams()
  const category = getCategory(slug)
  const { localize, t } = useLanguage()
  const [sort, setSort] = useState("featured")
  const [subcategory, setSubcategory] = useState("all")
  const categoryProducts = getProductsByCategory(slug)
  const subcategoryNames = category ? localize(category.subcategories) : []
  const hasSubcategoryFilters = categoryProducts.some((product) => product.subcategory)

  useEffect(() => {
    setSubcategory("all")
  }, [slug])

  const sortedProducts = useMemo(() => {
    const result = categoryProducts.filter((product) => subcategory === "all" || product.subcategory === subcategory)
    if (sort === "low") result.sort((a, b) => a.price - b.price)
    if (sort === "high") result.sort((a, b) => b.price - a.price)
    if (sort === "featured") result.sort((a, b) => Number(b.featured) - Number(a.featured))
    return result
  }, [categoryProducts, sort, subcategory])

  if (!category) return <Navigate to="/404" replace />
  const availabilityMessage = encodeURIComponent(`${t.actions.availability}: ${localize(category.name)}`)
  return (
    <div className="catalog-page">
      <header className="catalog-hero">
        <p className="eyebrow">{t.catalog.eyebrow}</p>
        <h1>{localize(category.name)}</h1>
        <p>{localize(category.description)}</p>
        <nav className="subcategory-list" aria-label={localize(category.name)}>
          {hasSubcategoryFilters && <button type="button" className={subcategory === "all" ? "active" : ""} onClick={() => setSubcategory("all")}>{t.catalog.all}</button>}
          {subcategoryNames.map((item, index) => hasSubcategoryFilters ? (
            <button type="button" key={item} className={subcategory === String(index) ? "active" : ""} onClick={() => setSubcategory(String(index))}>{item}</button>
          ) : <span key={item}>{item}</span>)}
        </nav>
      </header>
      <section className="section catalog-content">
        <div className="catalog-toolbar">
          <p>{sortedProducts.length} {sortedProducts.length === 1 ? t.catalog.result : t.catalog.results}</p>
          <label><span>{t.catalog.sort}</span><select value={sort} onChange={(event) => setSort(event.target.value)}><option value="featured">{t.catalog.featured}</option><option value="low">{t.catalog.priceLow}</option><option value="high">{t.catalog.priceHigh}</option></select></label>
        </div>
        {sortedProducts.length > 0 ? <div className="product-grid catalog-grid">{sortedProducts.map((product) => <ProductCard key={product.id} product={product} />)}</div> : (
          <div className="empty-state">
            {category.coverImage && <img src={`${import.meta.env.BASE_URL}${category.coverImage}`} alt={localize(category.name)} />}
            <div><p className="eyebrow">{localize(category.name)}</p><h2>{t.catalog.empty}</h2><p>{localize(category.description)}</p><a className="button button-dark" href={`https://wa.me/18319980610?text=${availabilityMessage}`} target="_blank" rel="noreferrer">{t.actions.availability}</a></div>
          </div>
        )}
      </section>
    </div>
  )
}
