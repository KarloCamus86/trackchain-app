import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { hardhat, sepolia } from 'wagmi/chains'

/**
 * Wagmi + RainbowKit config.
 *
 * - Primary chain: hardhat (localhost:8545)
 * - Secondary chain: sepolia (for testnet deploys)
 * - projectId: replace with a real WalletConnect Cloud ID before production
 *   → https://cloud.walletconnect.com
 */
export const wagmiConfig = getDefaultConfig({
  appName:   'TraceChain',
  projectId: 'tracechain-demo',
  chains:    [hardhat, sepolia],
})
