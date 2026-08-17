import { createContext, useContext, useEffect, useMemo, useState } from "react"
import { collection, onSnapshot, orderBy, query } from "firebase/firestore"
import { db } from "../firebase"
import { products as catalogProducts } from "../data/catalog"

const ProductsContext = createContext(null)

export function ProductsProvider({ children }) {
  const [dbProducts, setDbProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Escucha en vivo los productos que la admin agrega en la base de datos.
    // Si falla (por ejemplo, sin conexion), seguimos mostrando el catalogo base.
    const productsQuery = query(collection(db, "products"), orderBy("createdAt", "desc"))
    const unsubscribe = onSnapshot(
      productsQuery,
      (snapshot) => {
        setDbProducts(snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() })))
        setLoading(false)
      },
      () => setLoading(false),
    )
    return unsubscribe
  }, [])

  const value = useMemo(() => {
    // Catalogo base (en el codigo) + productos que sube la admin (en Firestore).
    const products = [...dbProducts, ...catalogProducts]
    return {
      products,
      dbProducts,
      loading,
      getProduct: (id) => products.find((product) => product.id === id),
      getProductsByCategory: (slug) => products.filter((product) => product.category === slug),
    }
  }, [dbProducts, loading])

  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>
}

// oxlint-disable-next-line react/only-export-components
export const useProducts = () => useContext(ProductsContext)
