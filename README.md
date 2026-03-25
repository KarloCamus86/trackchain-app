# TraceChain — Blockchain Supply Chain Tracker

![React](https://img.shields.io/badge/React-18.3-61DAFB?style=flat&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?style=flat&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-06B6D4?style=flat&logo=tailwindcss&logoColor=white)
![Ethereum Ready](https://img.shields.io/badge/Ethereum-Ready-3C3C3D?style=flat&logo=ethereum&logoColor=white)

## What is this?

TraceChain is a supply chain traceability dApp that lets producers, distributors, and consumers verify a product's full journey — from factory floor to end delivery — with an immutable event log. This is **Phase 1**: a fully functional React frontend backed by mock data, architected to plug directly into Ethereum smart contracts in Phase 2. The QR code system is already production-ready: scanning a product's code opens a mobile-optimized public view that works on any device, at any domain.

## Demo

**Live:** _[Add your Vercel URL here after deploying]_

**Screenshots:** _[Add screenshots here]_

---

## Features (Phase 1)

- **Product registry** — browse all registered products in a responsive card grid with status badges
- **Supply chain timeline** — full event log per product (Fabricación → Almacén → Transporte → Distribución → Entrega) with verified/pending visual indicators and a progress bar
- **QR code generation** — each product detail page generates a QR pointing to its public URL, domain-agnostic via `window.location.origin`
- **Public consumer view** — mobile-optimized page accessible by scanning the QR; no login required
- **Product registration form** — add new products to the registry; redirects to home on submit
- **Graceful error handling** — 404 catch-all route, not-found states with navigation links, and `undefined` status fallbacks throughout

---

## Tech Stack

| Technology | Version | Role |
|---|---|---|
| React | 18.3 | UI framework |
| Vite | 5.4 | Build tool & dev server |
| TailwindCSS | 3.4 | Utility-first styling with custom brand palette |
| React Router v6 | 6.26 | Client-side routing (4 routes + 404) |
| qrcode.react | 3.1 | QR code generation for public product URLs |
| React Context API | — | Shared product state across pages |

---

## Component Architecture

```
src/
├── App.jsx                  # Root: ProductsProvider + BrowserRouter + Routes
├── main.jsx                 # Entry point
├── index.css                # Tailwind directives + base layer
│
├── context/
│   └── ProductsContext.jsx  # Global state: products array + addProduct()
│
├── data/
│   └── mockProducts.js      # 3 food supply chain products with full event logs
│
├── hooks/
│   └── useTraceability.js   # useProducts() + useProduct(id) — reads from Context
│
├── components/
│   ├── Navbar.jsx           # Logo + nav links (active state via NavLink)
│   ├── Footer.jsx           # Copyright footer
│   └── ProductImage.jsx     # Category-based gradient placeholder (sm/md/lg sizes)
│
└── pages/
    ├── Home.jsx             # Product grid with skeleton loader + hover effects
    ├── CreateProduct.jsx    # Form → addProduct() → navigate('/')
    ├── ProductDetail.jsx    # Timeline + QR code panel (sticky on desktop)
    ├── PublicView.jsx       # Mobile-first consumer view (no auth required)
    └── NotFound.jsx         # 404 catch-all with link to Home
```

**Route map:**

```
/                →  Home
/create          →  CreateProduct
/product/:id     →  ProductDetail
/public/:id      →  PublicView       ← QR codes point here
*                →  NotFound
```

---

## Roadmap

| Phase | Status | Scope |
|---|---|---|
| **Phase 1 — Frontend** | ✅ Done | React UI, mock data, QR system, routing, responsive design |
| **Phase 2 — Smart Contracts** | 🔜 Next | Solidity contracts, Wagmi + RainbowKit wallet connect, on-chain event writes |
| **Phase 3 — Decentralized Storage** | 🔜 Planned | IPFS for product metadata and images via web3.storage |
| **Phase 4 — Enterprise Network** | 🔜 Planned | Private Hyperledger Fabric network for B2B supply chains |

---

## Running Locally

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/trackchain-app.git
cd trackchain-app

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
# → http://localhost:5173

# 4. Build for production
npm run build

# 5. Preview the production build locally
npm run preview
```

**Requirements:** Node.js 18+ and npm 9+

---

## Deploying to Vercel

The project includes a `vercel.json` that rewrites all routes to `index.html`, which is required for React Router to work correctly on page refresh or direct URL access.

1. Push the repository to GitHub
2. Go to [vercel.com](https://vercel.com) → **Add New Project** → import the repo
3. Framework preset: **Vite** (auto-detected)
4. Build command: `npm run build` — output directory: `dist`
5. Click **Deploy**

No environment variables are required for Phase 1.

---

## License

MIT
