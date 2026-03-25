import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ProductsProvider } from './context/ProductsContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import CreateProduct from './pages/CreateProduct'
import ProductDetail from './pages/ProductDetail'
import PublicView from './pages/PublicView'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <ProductsProvider>
      <BrowserRouter>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/"            element={<Home />} />
              <Route path="/create"      element={<CreateProduct />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/public/:id"  element={<PublicView />} />
              <Route path="*"            element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </ProductsProvider>
  )
}
