import { NavLink } from 'react-router-dom'
import WalletConnectButton from './ConnectButton'

const links = [
  { to: '/',       label: 'Inicio' },
  { to: '/create', label: 'Registrar' },
]

function ChainIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"
      strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  )
}

export default function Navbar() {
  return (
    <header className="bg-brand-700 text-white border-b border-brand-900/40 shadow-md">
      <nav className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">

        {/* Logo */}
        <NavLink
          to="/"
          className="flex items-center gap-2 group"
        >
          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/10 group-hover:bg-white/20 transition-colors">
            <ChainIcon />
          </span>
          <span className="text-lg font-bold tracking-tight leading-none">
            Trace<span className="text-brand-200">Chain</span>
          </span>
        </NavLink>

        {/* Right side: nav links + wallet */}
        <div className="flex items-center gap-3">
          <ul className="flex items-center gap-1 text-sm font-medium">
            {links.map(({ to, label }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end
                  className={({ isActive }) =>
                    isActive
                      ? 'px-3 py-1.5 rounded-md bg-white/15 text-white'
                      : 'px-3 py-1.5 rounded-md text-brand-100/80 hover:text-white hover:bg-white/10 transition-colors'
                  }
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="w-px h-5 bg-white/20" aria-hidden />
          <WalletConnectButton />
        </div>
      </nav>
    </header>
  )
}
