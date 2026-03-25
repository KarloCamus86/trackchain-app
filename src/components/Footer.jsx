export default function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-400 text-sm py-6 mt-8">
      <div className="max-w-6xl mx-auto px-4 text-center">
        © {new Date().getFullYear()} TraceChain — dApp de Trazabilidad de Productos
      </div>
    </footer>
  )
}
