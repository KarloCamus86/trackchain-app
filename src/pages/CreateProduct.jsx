import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProductsContext } from '../context/ProductsContext'

const EMPTY_FORM = {
  name: '',
  manufacturer: '',
  category: '',
}

export default function CreateProduct() {
  const navigate = useNavigate()
  const { addProduct } = useProductsContext()
  const [form, setForm] = useState(EMPTY_FORM)

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handleSubmit(e) {
    e.preventDefault()

    const newProduct = {
      id: `prod-${Date.now()}`,
      name: form.name,
      category: form.category,
      manufacturer: form.manufacturer,
      createdAt: new Date().toISOString().slice(0, 10),
      currentStatus: 'Pendiente',
      events: [],
    }

    addProduct(newProduct)
    navigate('/')
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-brand-700 mb-6">Registrar nuevo producto</h1>

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
            placeholder="Ej: Café Orgánico Sierra Nevada"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
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
            placeholder="Ej: Cooperativa Café del Sur"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
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
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="">Selecciona una categoría</option>
            <option value="Alimentos">Alimentos</option>
            <option value="Materias primas">Materias primas</option>
            <option value="Textil">Textil</option>
            <option value="Farmacéutico">Farmacéutico</option>
            <option value="Electrónica">Electrónica</option>
          </select>
        </div>

        <div className="flex gap-3 pt-1">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2.5 rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="flex-1 bg-brand-600 hover:bg-brand-700 text-white font-semibold py-2.5 rounded-lg transition-colors"
          >
            Registrar
          </button>
        </div>
      </form>
    </div>
  )
}
