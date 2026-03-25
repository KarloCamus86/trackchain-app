import { createContext, useContext, useState } from 'react'
import { mockProducts } from '../data/mockProducts'

const ProductsContext = createContext(null)

export function ProductsProvider({ children }) {
  const [products, setProducts] = useState(mockProducts)

  function addProduct(newProduct) {
    setProducts((prev) => [newProduct, ...prev])
  }

  return (
    <ProductsContext.Provider value={{ products, addProduct }}>
      {children}
    </ProductsContext.Provider>
  )
}

export function useProductsContext() {
  return useContext(ProductsContext)
}
