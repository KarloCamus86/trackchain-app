import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { useProductsContext } from '../context/ProductsContext'
import { REGISTRY_ADDRESS, REGISTRY_ABI } from '../config/contracts'

const EMPTY_FORM = { name: '', manufacturer: '', category: '' }

// ─── Status banner ────────────────────────────────────────────────────────────

function TxBanner({ isPending, isConfirming, isSuccess, error }) {
  if (error) {
    const msg = error.shortMessage ?? error.message ?? 'Error desconocido'
    return (
      <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
        <strong>Error:</strong> {msg}
      </div>
    )
  }
  if (isPending)    return <Banner color="yellow" text="Esperando confirmación en la wallet…" />
  if (isConfirming) return <Banner color="blue"   text="Transacción enviada — confirmando en la red…" />
  if (isSuccess)    return <Banner color="green"  text="Producto registrado en blockchain ✅" />
  return null
}

function Banner({ color, text }) {
  const styles = {
    yellow: 'bg-yellow-50 border-yellow-200 text-yellow-700',
    blue:   'bg-blue-50  border-blue-200  text-blue-700',
    green:  'bg-brand-50 border-brand-200 text-brand-700',
  }
  return (
    <div className={`rounded-lg border px-4 py-3 text-sm ${styles[color]}`}>
      {text}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CreateProduct() {
  const navigate      = useNavigate()
  const { isConnected } = useAccount()
  const { addProduct }  = useProductsContext()

  const [form, setForm] = useState(EMPTY_FORM)

  // ── Wagmi write hook (only active when wallet is connected) ───────────────
  const {
    writeContract,
    data:      txHash,
    isPending,
    error:     writeError,
    reset:     resetWrite,
  } = useWriteContract()

  const {
    isLoading: isConfirming,
    isSuccess,
  } = useWaitForTransactionReceipt({ hash: txHash })

  // Redirect to Home once the transaction is confirmed
  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => navigate('/'), 1500)
      return () => clearTimeout(timer)
    }
  }, [isSuccess, navigate])

  // ── Handlers ─────────────────────────────────────────────────────────────
  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    if (writeError) resetWrite()
  }

  function handleSubmit(e) {
    e.preventDefault()

    if (isConnected) {
      // ── Blockchain path ──────────────────────────────────────────────────
      writeContract({
        address:      REGISTRY_ADDRESS,
        abi:          REGISTRY_ABI,
        functionName: 'createProduct',
        args:         [form.name, form.category, form.manufacturer],
      })
    } else {
      // ── Mock fallback path ───────────────────────────────────────────────
      addProduct({
        id:            `prod-${Date.now()}`,
        name:          form.name,
        category:      form.category,
        manufacturer:  form.manufacturer,
        createdAt:     new Date().toISOString().slice(0, 10),
        currentStatus: 'Pendiente',
        events:        [],
      })
      navigate('/')
    }
  }

  const isBusy = isPending || isConfirming

  return (
    <div className="max-w-lg mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-brand-700 mb-2">
        Registrar nuevo producto
      </h1>

      {/* Mode indicator */}
      <p className="text-sm text-gray-500 mb-6">
        {isConnected
          ? '🔗 Modo blockchain — el producto se guardará en el contrato.'
          : '📋 Modo demo — conecta tu wallet para guardar en blockchain.'}
      </p>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-6 space-y-5">

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre del producto
          </label>
          <input
            type="text"
            name="name"
            required
            value={form.name}
            onChange={handleChange}
            disabled={isBusy}
            placeholder="Ej: Café Orgánico Sierra Nevada"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:bg-gray-50 disabled:text-gray-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Empresa fabricante
          </label>
          <input
            type="text"
            name="manufacturer"
            required
            value={form.manufacturer}
            onChange={handleChange}
            disabled={isBusy}
            placeholder="Ej: Cooperativa Café del Sur"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:bg-gray-50 disabled:text-gray-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Categoría
          </label>
          <select
            name="category"
            required
            value={form.category}
            onChange={handleChange}
            disabled={isBusy}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:bg-gray-50 disabled:text-gray-400"
          >
            <option value="">Selecciona una categoría</option>
            <option value="Alimentos">Alimentos</option>
            <option value="Materias primas">Materias primas</option>
            <option value="Textil">Textil</option>
            <option value="Farmacéutico">Farmacéutico</option>
            <option value="Electrónica">Electrónica</option>
          </select>
        </div>

        {/* Transaction status */}
        <TxBanner
          isPending={isPending}
          isConfirming={isConfirming}
          isSuccess={isSuccess}
          error={writeError}
        />

        <div className="flex gap-3 pt-1">
          <button
            type="button"
            onClick={() => navigate('/')}
            disabled={isBusy}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2.5 rounded-lg transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isBusy || isSuccess}
            className="flex-1 bg-brand-600 hover:bg-brand-700 text-white font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {isPending    && 'Esperando wallet…'}
            {isConfirming && 'Confirmando…'}
            {isSuccess    && 'Registrado ✅'}
            {!isPending && !isConfirming && !isSuccess && (
              isConnected ? 'Registrar en blockchain' : 'Registrar'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
