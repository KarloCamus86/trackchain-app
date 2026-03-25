import { useParams, Link } from 'react-router-dom'
import { useProduct } from '../hooks/useTraceability'
import ProductImage from '../components/ProductImage'

const STATUS_STYLES = {
  'Verificado':  { pill: 'bg-brand-100 text-brand-700 ring-1 ring-brand-200', dot: 'bg-brand-500' },
  'En tránsito': { pill: 'bg-yellow-100 text-yellow-700 ring-1 ring-yellow-200', dot: 'bg-yellow-400' },
  'Pendiente':   { pill: 'bg-gray-100 text-gray-600 ring-1 ring-gray-200', dot: 'bg-gray-300' },
}

const STAGE_ICONS = {
  'Fabricación':  '🏭',
  'Almacén':      '📦',
  'Transporte':   '🚛',
  'Distribución': '🏪',
  'Entrega':      '✅',
}

function formatDate(ts) {
  if (!ts) return ''
  return new Date(ts).toLocaleDateString('es-ES', {
    day: '2-digit', month: 'short', year: 'numeric',
  })
}

export default function PublicView() {
  const { id } = useParams()
  const { data: product, loading, error } = useProduct(id)

  if (loading) {
    return (
      <div className="max-w-md mx-auto px-4 py-12 animate-pulse space-y-4">
        <div className="h-4 bg-gray-100 rounded w-40 mx-auto" />
        <div className="h-32 bg-gray-100 rounded-2xl" />
        <div className="h-48 bg-gray-100 rounded-2xl" />
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
        <p className="text-5xl mb-4">🔍</p>
        <p className="text-gray-800 font-semibold">Producto no encontrado</p>
        <p className="text-sm text-gray-400 mt-2">Verifica que el código QR sea correcto.</p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors text-sm"
        >
          <span>&larr;</span> Ir al inicio
        </Link>
      </div>
    )
  }

  const verifiedEvents  = product.events.filter((e) => e.verified)
  const statusStyle     = STATUS_STYLES[product.currentStatus] ?? STATUS_STYLES['Pendiente']
  const progressPercent = product.events.length
    ? Math.round((verifiedEvents.length / product.events.length) * 100)
    : 0

  return (
    <div className="max-w-md mx-auto px-4 py-8 space-y-4">

      {/* TraceChain badge */}
      <div className="text-center">
        <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-brand-600 bg-brand-50 border border-brand-200 px-3 py-1.5 rounded-full">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
            strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
          TraceChain — Producto verificado
        </span>
      </div>

      {/* Product header */}
      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <ProductImage category={product.category} size="sm" />
        <div className="p-5">
          <h1 className="text-xl font-bold text-gray-900 leading-tight">{product.name}</h1>
          <p className="text-sm text-gray-500 mt-1">{product.manufacturer}</p>

          <div className="mt-3 flex items-center justify-between gap-3">
            <span className={`inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full font-bold ${statusStyle.pill}`}>
              <span className={`inline-block w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
              {product.currentStatus ?? 'Sin estado'}
            </span>
            <span className="text-xs text-gray-400">
              {verifiedEvents.length}/{product.events.length} verificados
            </span>
          </div>

          {/* Progress bar */}
          <div className="mt-3">
            <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-brand-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Events timeline */}
      <div className="bg-white rounded-2xl shadow p-5">
        <h2 className="text-sm font-semibold text-gray-700 mb-5">Recorrido del producto</h2>

        {product.events.length === 0 ? (
          <p className="text-sm text-gray-400 italic text-center py-4">
            Sin eventos registrados todavía.
          </p>
        ) : (
          <ol className="space-y-0">
            {product.events.map((event, i) => {
              const isLast     = i === product.events.length - 1
              const isVerified = event.verified

              return (
                <li key={i} className="flex gap-3">
                  {/* Connector */}
                  <div className="flex flex-col items-center shrink-0">
                    <div className={`flex h-9 w-9 items-center justify-center rounded-full border-2 text-base ${
                      isVerified
                        ? 'border-brand-400 bg-brand-50'
                        : 'border-gray-200 bg-gray-50'
                    }`}>
                      {isVerified ? '✓' : (STAGE_ICONS[event.stage] ?? '📍')}
                    </div>
                    {!isLast && (
                      <div className={`w-0.5 flex-1 mt-1 min-h-5 ${isVerified ? 'bg-brand-200' : 'bg-gray-200'}`} />
                    )}
                  </div>

                  {/* Content */}
                  <div className={`flex-1 pb-5 ${isLast ? 'pb-0' : ''}`}>
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-semibold text-gray-800">{event.stage}</p>
                      {isLast && (
                        <span className="text-xs px-1.5 py-0.5 rounded font-bold bg-brand-600 text-white">
                          Actual
                        </span>
                      )}
                      {!isVerified && (
                        <span className="text-xs text-gray-400">Pendiente</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">{event.description}</p>
                    <p className="text-xs text-gray-400 mt-1">{event.location}</p>
                    <p className="text-xs text-gray-400">{formatDate(event.timestamp)} · {event.actor}</p>
                  </div>
                </li>
              )
            })}
          </ol>
        )}
      </div>

      {/* Footer */}
      <p className="text-center text-xs text-gray-300 pb-4">
        ID: {product.id} · Registrado: {product.createdAt}
      </p>
    </div>
  )
}
