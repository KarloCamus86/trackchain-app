const CATEGORY_CONFIG = {
  'Alimentos':       { emoji: '🌿', from: 'from-green-50',   to: 'to-emerald-100', text: 'text-green-600' },
  'Materias primas': { emoji: '🌾', from: 'from-amber-50',   to: 'to-yellow-100',  text: 'text-amber-600' },
  'Textil':          { emoji: '🧵', from: 'from-purple-50',  to: 'to-violet-100',  text: 'text-purple-600' },
  'Farmacéutico':    { emoji: '💊', from: 'from-blue-50',    to: 'to-sky-100',     text: 'text-blue-600' },
  'Electrónica':     { emoji: '⚡', from: 'from-yellow-50',  to: 'to-orange-100',  text: 'text-orange-500' },
}

const DEFAULT = { emoji: '📦', from: 'from-gray-50', to: 'to-gray-100', text: 'text-gray-500' }

/**
 * Placeholder de imagen basado en categoría.
 * @param {string} category
 * @param {'sm'|'md'|'lg'} size  — controla la altura
 */
export default function ProductImage({ category, size = 'md' }) {
  const config = CATEGORY_CONFIG[category] ?? DEFAULT

  const heights = { sm: 'h-24', md: 'h-36', lg: 'h-48' }
  const emojis  = { sm: 'text-3xl', md: 'text-5xl', lg: 'text-6xl' }

  return (
    <div
      className={`w-full ${heights[size]} bg-gradient-to-br ${config.from} ${config.to} flex flex-col items-center justify-center gap-1 rounded-xl`}
    >
      <span className={emojis[size]}>{config.emoji}</span>
      <span className={`text-xs font-medium uppercase tracking-wide ${config.text}`}>
        {category}
      </span>
    </div>
  )
}
