import { Link } from "react-router-dom"
import { useLanguage } from "../context/LanguageContext"
import { getCategory } from "../data/catalog"
import { ArrowIcon } from "./Icons"

export default function ProductCard({ product, large = false }) {
  const { localize, t } = useLanguage()
  const category = getCategory(product.category)
  return (
    <article className={`product-card ${large ? "product-card-large" : ""}`}>
      <Link to={`/producto/${product.id}`} className="product-image-wrap" aria-label={localize(product.name)}>
        <img src={`${import.meta.env.BASE_URL}${product.images[0]}`} alt={localize(product.name)} loading="lazy" width="720" height="900" />
        {product.badge && <span className="product-badge">{localize(product.badge)}</span>}
      </Link>
      <div className="product-card-body">
        <p className="eyebrow">{localize(category.name)}</p>
        <h3><Link to={`/producto/${product.id}`}>{localize(product.name)}</Link></h3>
        {large && <p className="product-excerpt">{localize(product.description)}</p>}
        <div className="product-card-footer">
          <div>
            <p className="price">${product.price.toFixed(2)}</p>
            <p className="installments">{t.product.payments} ${(product.price / 4).toFixed(2)}</p>
          </div>
          <Link to={`/producto/${product.id}`} className="round-arrow" aria-label={`${t.actions.view}: ${localize(product.name)}`}><ArrowIcon /></Link>
        </div>
      </div>
    </article>
  )
}
