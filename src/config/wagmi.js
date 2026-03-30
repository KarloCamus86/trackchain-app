import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { hardhat, sepolia } from 'wagmi/chains'

// VITE_NETWORK=sepolia  → primary chain is Sepolia (production / Vercel)
// VITE_NETWORK=<any>    → both chains available, Hardhat first (local dev)
const isSepolia = import.meta.env.VITE_NETWORK === 'sepolia'

export const wagmiConfig = getDefaultConfig({
  appName:   'TraceChain',
  projectId: 'tracechain-demo', // Replace with real WalletConnect Cloud ID before prod
  chains:    isSepolia ? [sepolia] : [hardhat, sepolia],
})
