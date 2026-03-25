import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 text-center">
      <p className="text-8xl font-black text-gray-100 select-none leading-none">404</p>
      <p className="text-2xl font-bold text-gray-800 mt-2">Página no encontrada</p>
      <p className="text-gray-500 mt-2 max-w-sm">
        La ruta que buscas no existe o el producto fue eliminado.
      </p>
      <Link
        to="/"
        className="mt-8 inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
      >
        <span>&larr;</span> Volver al inicio
      </Link>
    </div>
  )
}
