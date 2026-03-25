import { useParams, Link } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
import { useProduct } from '../hooks/useTraceability'
import ProductImage from '../components/ProductImage'

const STATUS_STYLES = {
  'Verificado':  'bg-brand-100 text-brand-700 ring-1 ring-brand-200',
  'En tránsito': 'bg-yellow-100 text-yellow-700 ring-1 ring-yellow-200',
  'Pendiente':   'bg-gray-100 text-gray-500 ring-1 ring-gray-200',
}

const STAGE_ICONS = {
  'Fabricación':  '🏭',
  'Almacén':      '📦',
  'Transporte':   '🚛',
  'Distribución': '🏪',
  'Entrega':      '✅',
}

function formatTimestamp(ts) {
  if (!ts) return ''
  return new Date(ts).toLocaleString('es-ES', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

function TimelineEvent({ event, isLast }) {
  const verified = event.verified

  return (
    <li className="flex gap-4">
      {/* Connector column */}
      <div className="flex flex-col items-center shrink-0">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-full border-2 text-lg transition-colors ${
            verified
              ? 'bg-brand-50 border-brand-400 shadow-sm shadow-brand-100'
              : 'bg-gray-50 border-gray-200'
          }`}
        >
          {verified ? '✓' : (STAGE_ICONS[event.stage] ?? '📍')}
        </div>
        {!isLast && (
          <div className={`w-0.5 flex-1 mt-1 min-h-6 ${verified ? 'bg-brand-200' : 'bg-gray-200'}`} />
        )}
      </div>

      {/* Content card */}
      <div
        className={`flex-1 pb-6 rounded-xl border p-4 mb-1 ${
          isLast
            ? 'border-brand-200 bg-brand-50/40 shadow-sm'
            : verified
              ? 'border-brand-100 bg-white'
              : 'border-gray-100 bg-gray-50/60'
        }`}
      >
        <div className="flex items-start justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-800">{event.stage}</span>
            {isLast && (
              <span className="text-xs font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-brand-600 text-white">
                Último estado
              </span>
            )}
          </div>
          {verified ? (
            <span className="text-xs font-medium text-brand-600 flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Verificado
            </span>
          ) : (
            <span className="text-xs font-medium text-gray-400">Pendiente</span>
          )}
        </div>

        <p className="text-sm text-gray-700 mt-1.5 leading-relaxed">{event.description}</p>

        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
          <span className="text-xs text-gray-500 flex items-center gap-1">
            <span>📍</span>{event.location}
          </span>
          <span className="text-xs text-gray-400 flex items-center gap-1">
            <span>🏢</span>{event.actor}
          </span>
        </div>
        <time className="text-xs text-gray-400 mt-1 block">
          {formatTimestamp(event.timestamp)}
        </time>
      </div>
    </li>
  )
}

export default function ProductDetail() {
  const { id } = useParams()
  const { data: product, loading, error } = useProduct(id)

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10 animate-pulse space-y-6">
        <div className="h-4 bg-gray-100 rounded w-32" />
        <div className="h-48 bg-gray-100 rounded-xl" />
        <div className="h-64 bg-gray-100 rounded-xl" />
      </div>
    )
  }
  if (error || !product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
        <p className="text-5xl mb-4">📦</p>
        <p className="text-gray-800 font-semibold text-lg">Producto no encontrado</p>
        <p className="text-sm text-gray-400 mt-1">
          {error ? error.message : 'El ID solicitado no existe en el registro.'}
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors text-sm"
        >
          <span>&larr;</span> Volver al listado
        </Link>
      </div>
    )
  }

  const publicUrl     = `${window.location.origin}/public/${product.id}`
  const verifiedCount = product.events.filter((e) => e.verified).length

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <Link to="/" className="text-sm text-brand-600 hover:underline mb-6 inline-flex items-center gap-1">
        <span>&larr;</span> Volver al listado
      </Link>

      <div className="grid md:grid-cols-3 gap-8 mt-4">

        {/* Left: product header + timeline */}
        <div className="md:col-span-2 space-y-6">

          {/* Header card */}
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <ProductImage category={product.category} size="lg" />
            <div className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h1 className="text-2xl font-bold text-gray-900 leading-tight">{product.name}</h1>
                  <p className="text-sm text-gray-500 mt-1">{product.manufacturer}</p>
                  <p className="text-xs text-gray-400 mt-0.5">Registrado el {product.createdAt}</p>
                </div>
                <span className={`shrink-0 text-xs px-3 py-1.5 rounded-full font-bold ${
                  STATUS_STYLES[product.currentStatus] ?? STATUS_STYLES['Pendiente']
                }`}>
                  {product.currentStatus ?? 'Sin estado'}
                </span>
              </div>

              {/* Verified progress */}
              <div className="mt-4">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Eventos verificados</span>
                  <span className="font-medium text-brand-600">
                    {verifiedCount} / {product.events.length}
                  </span>
                </div>
                <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-brand-500 rounded-full transition-all"
                    style={{ width: product.events.length ? `${(verifiedCount / product.events.length) * 100}%` : '0%' }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-5">Cadena de custodia</h2>

            {product.events.length === 0 ? (
              <p className="text-sm text-gray-400 italic py-4 text-center">
                Sin eventos registrados todavía.
              </p>
            ) : (
              <ol className="space-y-0">
                {product.events.map((event, i) => (
                  <TimelineEvent
                    key={i}
                    event={event}
                    isLast={i === product.events.length - 1}
                  />
                ))}
              </ol>
            )}
          </div>
        </div>

        {/* Right: QR */}
        <div>
          <div className="bg-white rounded-xl shadow p-6 text-center sticky top-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">
              Vista pública
            </p>
            <div className="inline-block p-3 bg-gray-50 rounded-xl border border-gray-100">
              <QRCodeSVG value={publicUrl} size={148} />
            </div>
            <p className="text-xs text-gray-400 mt-3 break-all leading-relaxed">{publicUrl}</p>
            <Link
              to={`/public/${product.id}`}
              className="inline-flex items-center gap-1 mt-4 text-sm font-medium text-brand-600 hover:text-brand-700 hover:underline"
            >
              Abrir vista pública <span>&rarr;</span>
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}
