import { useState, useEffect } from 'react'
import { useProductsContext } from '../context/ProductsContext'

/**
 * Returns the full product list from shared context.
 * Simulates async loading. Swap with a real contract/API call later.
 */
export function useProducts() {
  const { products } = useProductsContext()
  const [data, setData]       = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setData(products)
      setLoading(false)
    }, 300)
    return () => clearTimeout(timer)
  }, [products])

  return { data, loading, error: null }
}

/**
 * Returns a single product by id from shared context.
 */
export function useProduct(id) {
  const { products } = useProductsContext()
  const [data, setData]       = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  useEffect(() => {
    setLoading(true)
    const timer = setTimeout(() => {
      const found = products.find((p) => p.id === id) ?? null
      if (!found) {
        setError(new Error(`Producto "${id}" no encontrado`))
      } else {
        setData(found)
        setError(null)
      }
      setLoading(false)
    }, 300)
    return () => clearTimeout(timer)
  }, [id, products])

  return { data, loading, error }
}
