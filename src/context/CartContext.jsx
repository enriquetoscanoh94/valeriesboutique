import { createContext, useContext, useEffect, useMemo, useState } from "react"

const CartContext = createContext(null)
const STORAGE_KEY = "valeries-cart-v1"

function readCart() {
  try {
    const value = JSON.parse(localStorage.getItem(STORAGE_KEY))
    return Array.isArray(value) ? value : []
  } catch {
    return []
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(readCart)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const addItem = (product, options = {}) => {
    const key = `${product.id}:${options.size || "na"}:${options.color || "na"}`
    setItems((current) => {
      const existing = current.find((item) => item.key === key)
      if (existing) {
        return current.map((item) => item.key === key ? { ...item, quantity: item.quantity + (options.quantity || 1) } : item)
      }
      return [...current, { key, productId: product.id, size: options.size || "", color: options.color || "", quantity: options.quantity || 1 }]
    })
  }

  const updateQuantity = (key, quantity) => {
    if (quantity < 1) return
    setItems((current) => current.map((item) => item.key === key ? { ...item, quantity } : item))
  }

  const removeItem = (key) => setItems((current) => current.filter((item) => item.key !== key))

  const itemCount = items.reduce((total, item) => total + item.quantity, 0)

  const value = useMemo(() => ({ items, addItem, updateQuantity, removeItem, itemCount }), [items, itemCount])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

// oxlint-disable-next-line react/only-export-components
export const useCart = () => useContext(CartContext)
