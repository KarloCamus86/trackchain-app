import { ConnectButton } from '@rainbow-me/rainbowkit'

/**
 * Wrapper around RainbowKit's ConnectButton.Custom.
 * Styled to match the green Navbar brand palette.
 */
export default function WalletConnectButton() {
  return (
    <ConnectButton.Custom>
      {({ account, chain, openAccountModal, openChainModal, openConnectModal, mounted }) => {
        // While RainbowKit is mounting, render an invisible placeholder
        // to avoid layout shift.
        if (!mounted) {
          return (
            <span
              aria-hidden
              className="inline-block w-28 h-8 rounded-lg bg-white/10"
            />
          )
        }

        // ── Not connected ─────────────────────────────────────────────────────
        if (!account) {
          return (
            <button
              onClick={openConnectModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/20 hover:border-white/40"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 shrink-0">
                <rect x="2" y="7" width="20" height="14" rx="2" />
                <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
                <line x1="12" y1="12" x2="12" y2="16" />
                <line x1="10" y1="14" x2="14" y2="14" />
              </svg>
              Conectar wallet
            </button>
          )
        }

        // ── Wrong network ────────────────────────────────────────────────────
        if (chain?.unsupported) {
          return (
            <button
              onClick={openChainModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold bg-red-500/80 hover:bg-red-500 text-white transition-colors"
            >
              Red incorrecta
            </button>
          )
        }

        // ── Connected ────────────────────────────────────────────────────────
        const short = account.address
          ? `${account.address.slice(0, 6)}…${account.address.slice(-4)}`
          : account.displayName

        return (
          <div className="flex items-center gap-2">
            {/* Network pill */}
            {chain && (
              <button
                onClick={openChainModal}
                className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium bg-white/10 hover:bg-white/20 text-brand-100 transition-colors"
              >
                {chain.name}
              </button>
            )}

            {/* Account button */}
            <button
              onClick={openAccountModal}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold bg-brand-500/30 hover:bg-brand-500/50 text-white transition-colors border border-brand-400/40"
            >
              <span className="w-2 h-2 rounded-full bg-brand-400 shrink-0" />
              {short}
            </button>
          </div>
        )
      }}
    </ConnectButton.Custom>
  )
}
