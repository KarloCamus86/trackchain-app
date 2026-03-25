import { useState, useEffect } from 'react'
import { useAccount, useReadContract, useReadContracts } from 'wagmi'
import { useProductsContext } from '../context/ProductsContext'
import {
  REGISTRY_ADDRESS,
  REGISTRY_ABI,
  TRACE_LOG_ADDRESS,
  TRACE_LOG_ABI,
} from '../config/contracts'

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Returns true if `id` looks like a blockchain numeric ID ("1", "2", …). */
function isChainId(id) {
  return /^\d+$/.test(String(id))
}

/** Converts a blockchain Product tuple to the app's data shape. */
function mapChainProduct(raw, id, events = []) {
  const lastEvent = events.at(-1)
  return {
    id:            String(id),
    name:          raw.name,
    category:      raw.category,
    manufacturer:  raw.manufacturer,
    createdAt:     raw.createdAt
      ? new Date(Number(raw.createdAt) * 1000).toISOString().slice(0, 10)
      : '—',
    currentStatus: lastEvent?.stage ?? 'Pendiente',
    owner:         raw.owner,
    events:        events.map((e) => ({
      stage:       e.stage,
      location:    e.location,
      actor:       e.actor,
      description: e.description,
      timestamp:   new Date(Number(e.timestamp) * 1000).toISOString(),
      verified:    e.verified,
    })),
  }
}

// ─── useProducts ─────────────────────────────────────────────────────────────

/**
 * Returns the full product list.
 * - With wallet: reads from ProductRegistry on-chain.
 * - Without wallet: returns mock data from Context as fallback.
 */
export function useProducts() {
  const { isConnected } = useAccount()
  const { products: mockProducts } = useProductsContext()

  // ── Fallback (no wallet) ──────────────────────────────────────────────────
  const [fallbackData, setFallbackData] = useState([])
  const [fallbackLoading, setFallbackLoading] = useState(true)

  useEffect(() => {
    if (isConnected) return
    const t = setTimeout(() => {
      setFallbackData(mockProducts)
      setFallbackLoading(false)
    }, 300)
    return () => clearTimeout(t)
  }, [isConnected, mockProducts])

  // ── On-chain: step 1 — get total count ───────────────────────────────────
  const {
    data:      count,
    isLoading: countLoading,
  } = useReadContract({
    address:      REGISTRY_ADDRESS,
    abi:          REGISTRY_ABI,
    functionName: 'getProductCount',
    query:        { enabled: isConnected },
  })

  // Build array of IDs [1n, 2n, … count]
  const ids = count ? Array.from({ length: Number(count) }, (_, i) => BigInt(i + 1)) : []

  // ── On-chain: step 2 — batch-read all products ────────────────────────────
  const {
    data:      rawProducts,
    isLoading: productsLoading,
  } = useReadContracts({
    contracts: ids.map((id) => ({
      address:      REGISTRY_ADDRESS,
      abi:          REGISTRY_ABI,
      functionName: 'getProduct',
      args:         [id],
    })),
    query: { enabled: isConnected && ids.length > 0 },
  })

  // ── Return ────────────────────────────────────────────────────────────────
  if (!isConnected) {
    return { data: fallbackData, loading: fallbackLoading, error: null }
  }

  const loading = countLoading || productsLoading
  const data = (rawProducts ?? [])
    .filter((r) => r.status === 'success' && r.result?.exists)
    .map((r, i) => mapChainProduct(r.result, ids[i]))

  return { data, loading, error: null }
}

// ─── useProduct ───────────────────────────────────────────────────────────────

/**
 * Returns a single product with its full event log.
 * - With wallet + numeric ID: reads from on-chain contracts.
 * - Otherwise: searches mock data from Context.
 */
export function useProduct(id) {
  const { isConnected } = useAccount()
  const { products: mockProducts } = useProductsContext()

  const useChain = isConnected && isChainId(id)
  const chainId  = useChain ? BigInt(id) : 0n

  // ── Fallback ──────────────────────────────────────────────────────────────
  const [fallbackData, setFallbackData]     = useState(null)
  const [fallbackLoading, setFallbackLoading] = useState(true)
  const [fallbackError, setFallbackError]   = useState(null)

  useEffect(() => {
    if (useChain) return
    setFallbackLoading(true)
    const t = setTimeout(() => {
      const found = mockProducts.find((p) => p.id === id) ?? null
      if (!found) setFallbackError(new Error(`Producto "${id}" no encontrado`))
      else { setFallbackData(found); setFallbackError(null) }
      setFallbackLoading(false)
    }, 300)
    return () => clearTimeout(t)
  }, [id, useChain, mockProducts])

  // ── On-chain: product ─────────────────────────────────────────────────────
  const {
    data:      rawProduct,
    isLoading: productLoading,
    error:     productError,
  } = useReadContract({
    address:      REGISTRY_ADDRESS,
    abi:          REGISTRY_ABI,
    functionName: 'getProduct',
    args:         [chainId],
    query:        { enabled: useChain },
  })

  // ── On-chain: events ──────────────────────────────────────────────────────
  const {
    data:      rawEvents,
    isLoading: eventsLoading,
  } = useReadContract({
    address:      TRACE_LOG_ADDRESS,
    abi:          TRACE_LOG_ABI,
    functionName: 'getEvents',
    args:         [chainId],
    query:        { enabled: useChain },
  })

  // ── Return ────────────────────────────────────────────────────────────────
  if (!useChain) {
    return { data: fallbackData, loading: fallbackLoading, error: fallbackError }
  }

  const loading = productLoading || eventsLoading
  const error   = productError ? new Error(productError.shortMessage ?? productError.message) : null
  const data    = rawProduct?.exists
    ? mapChainProduct(rawProduct, id, rawEvents ?? [])
    : null

  return { data, loading, error }
}
