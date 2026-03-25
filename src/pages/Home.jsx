import { Link } from 'react-router-dom'
import { useProducts } from '../hooks/useTraceability'
import ProductImage from '../components/ProductImage'

const STATUS_STYLES = {
  'Verificado':  'bg-brand-100 text-brand-700',
  'En tránsito': 'bg-yellow-100 text-yellow-700',
  'Pendiente':   'bg-gray-100 text-gray-500',
}

export default function Home() {
  const { data: products, loading } = useProducts()

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">

      {/* Hero */}
      <section className="text-center mb-12">
        <h1 className="text-4xl font-bold text-brand-700 mb-4">
          Trazabilidad de Productos en la Cadena de Suministro
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-6">
          Verifica el origen y el recorrido de cada producto desde la fuente hasta tus manos,
          con registro inmutable en blockchain.
        </p>
        <Link
          to="/create"
          className="inline-block bg-brand-600 hover:bg-brand-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
        >
          Registrar nuevo producto
        </Link>
      </section>

      {/* Product list */}
      <section>
        <h2 className="text-2xl font-semibold mb-6">
          Productos registrados
          <span className="ml-2 text-base font-normal text-gray-400">({products.length})</span>
        </h2>

        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white rounded-xl shadow overflow-hidden animate-pulse">
                <div className="h-36 bg-gray-100" />
                <div className="p-5 space-y-2">
                  <div className="h-3 bg-gray-100 rounded w-1/3" />
                  <div className="h-4 bg-gray-100 rounded w-3/4" />
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Link
                key={product.id}
                to={`/product/${product.id}`}
                className="group bg-white rounded-xl shadow hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 overflow-hidden flex flex-col"
              >
                <ProductImage category={product.category} size="md" />

                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-semibold text-gray-800 text-base leading-snug group-hover:text-brand-700 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">{product.manufacturer}</p>
                  <p className="text-xs text-gray-400 mt-0.5">Registrado: {product.createdAt}</p>

                  <div className="mt-auto pt-4 flex items-center justify-between">
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                        STATUS_STYLES[product.currentStatus] ?? STATUS_STYLES['Pendiente']
                      }`}
                    >
                      {product.currentStatus}
                    </span>
                    <span className="text-xs text-gray-400">
                      {product.events.length} evento{product.events.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
