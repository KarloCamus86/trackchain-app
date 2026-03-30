import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { hardhat, sepolia } from 'wagmi/chains'

// VITE_NETWORK=sepolia  → primary chain is Sepolia (production / Vercel)
// VITE_NETWORK=<any>    → both chains available, Hardhat first (local dev)
const isSepolia = import.meta.env.VITE_NETWORK === 'sepolia'

// WalletConnect Cloud project ID — get one free at https://cloud.walletconnect.com
const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID ?? 'tracechain-demo'

// Override the Sepolia RPC with Alchemy when the env var is set,
// otherwise viem's public RPC is used (rate-limited, fine for dev).
const sepoliaChain = import.meta.env.VITE_ALCHEMY_RPC_URL
  ? { ...sepolia, rpcUrls: { default: { http: [import.meta.env.VITE_ALCHEMY_RPC_URL] } } }
  : sepolia

export const wagmiConfig = getDefaultConfig({
  appName:   'TraceChain',
  projectId,
  chains: isSepolia ? [sepoliaChain] : [hardhat, sepoliaChain],
})
