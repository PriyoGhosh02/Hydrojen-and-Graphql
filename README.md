# ⌚ TimeCrafts — Luxury Horology & Headless Storefront

> A high-performance, editorial-grade headless e-commerce experience for luxury timepieces and bespoke jewelry, powered by **Shopify Hydrogen**, **React Router v7**, **Storefront GraphQL API**, and **GSAP Scroll Storytelling**.

🌐 **Live Storefront:** [https://timecraftswatches.vercel.app/](https://timecraftswatches.vercel.app/)  
📦 **Repository:** [GitHub Repository](https://github.com/PriyoGhosh02/Hydrojen-and-Graphql)

---

## 📖 Project Overview & Purpose

**TimeCrafts** is a flagship headless commerce storefront designed to demonstrate modern luxury web aesthetics, bespoke scroll-driven interactions, and sub-second page loads. 

The project connects directly to Shopify's **Storefront GraphQL API** to dynamically fetch live products, custom collections, metafields, metaobjects, and customer checkout sessions while providing a bespoke, cinematic frontend experience.

---

## 🛠️ Technology Stack

| Technology | Purpose |
| :--- | :--- |
| **Shopify Hydrogen (2026.4)** | Official headless commerce framework for Shopify |
| **React Router v7** | Full-stack routing, nested layouts, and SSR data loading |
| **Shopify Storefront GraphQL API** | Real-time product catalog, cart mutations, and metaobjects |
| **GSAP & ScrollTrigger (3.15)** | High-performance scroll pinning, parallax, and ticker animations |
| **Tailwind CSS v4** | Modern utility-first styling with custom design tokens |
| **Jost Typography** | Sleek, modern geometric sans-serif typeface used site-wide |
| **TypeScript** | Strict end-to-end type safety and schema validation |
| **Vercel Edge Functions** | Serverless Edge SSR deployment and global CDN caching |

---

## ✨ Key Architectural Features & Sections

### 1. 🖼️ Editorial Hero Section
* Dynamic full-bleed visual banner loaded directly from Shopify Storefront queries.
* Micro-animations and responsive call-to-actions.

### 2. 🗂️ Featured Collections & Product Catalog
* Dynamic category showcase with smooth image hover zooms.
* Product grid with real-time currency formatting, badges, and instant Cart Drawer integration.

### 3. 📜 Image with Text (Sticky Pin Storytelling)
* GSAP ScrollTrigger pinning sequence where editorial imagery locks in place while storytelling copy flows alongside.

### 4. 🔄 Brand Showcase (Infinite Auto-Scroll Marquee)
* Edge-masked, continuous infinite marquee powered by GSAP ticker translation for partner brands and horological emblems.

### 5. 🎴 3-Banner Overlapping Scroll Story
* Dynamic metaobject query (`3_banner`).
* Sequential scroll-pinned cards: as the user scrolls down, each banner card expands to full height and stacks smoothly over the previous card.

### 6. 🛡️ Trust & Value Feature Bar
* 7 curated brand value badges on pitch-black background with custom stroke vector iconography:
  * Over 3000+ Styles
  * No Cost EMI above 7k
  * COD Available up to 25k
  * 10% Welcome Discount (WELCOME10)
  * 100% Certified Authentic
  * Easy 7-Day Returns & Exchange
  * Dispatched in 24 Hours

### 7. ❓ Minimalist Interactive FAQ Section
* Clean divider layout with smooth `+` / `−` animated accordion drawers covering authenticity, warranties, and care instructions.

### 8. 🏛️ 4-Column Modern Footer
* Brand summary & 4 interactive social media channels.
* Dynamic navigation loaded directly from Shopify menus:
  * **Explore:** `main-menu-hydro`
  * **Information:** `footer`
* Interactive newsletter subscription form with instant feedback.

---

## 📂 Project Structure

```text
├── app/
│   ├── components/            # Reusable UI & Storytelling Components
│   │   ├── BrandShowcase.tsx  # Infinite auto-scrolling brand marquee
│   │   ├── CartDrawer.tsx     # Slide-out interactive cart drawer
│   │   ├── FaqSection.tsx     # Minimalist interactive accordion FAQ
│   │   ├── FeatureBar.tsx     # 7-badge luxury trust points bar
│   │   ├── FeaturedCollections.tsx
│   │   ├── FeaturedProducts.tsx
│   │   ├── Footer.tsx         # 4-column dynamic footer with menus & newsletter
│   │   ├── Header.tsx         # Sticky navigation, search, and cart counter
│   │   ├── HeroSection.tsx    # Editorial hero banner
│   │   ├── ImageWithText.tsx  # Sticky scroll storytelling section
│   │   └── StackedBanners.tsx # 3-Banner sequential scroll-stacking section
│   ├── routes/                # React Router v7 routes
│   │   ├── ($locale)._index.tsx # Homepage route orchestrating all critical data
│   │   ├── ($locale).collections.$handle.tsx
│   │   ├── ($locale).products.$handle.tsx
│   │   └── ($locale).cart.tsx
│   ├── lib/                   # GraphQL fragments, context, & session utilities
│   ├── styles/                # Tailwind CSS v4 & global typography definitions
│   └── root.tsx               # Root layout, fonts preloading, & global providers
├── api/
│   └── index.js               # Vercel Edge Serverless Function bridge
├── vercel.json                # Vercel deployment routing & rewrites config
└── package.json
```

---

## 🚀 Getting Started Locally

### 1. Clone the repository
```bash
git clone https://github.com/PriyoGhosh02/Hydrojen-and-Graphql.git
cd Hydrojen-and-Graphql
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory:
```env
PUBLIC_STORE_DOMAIN=priyoghosh.myshopify.com
PUBLIC_CHECKOUT_DOMAIN=priyoghosh.myshopify.com
PUBLIC_STOREFRONT_API_TOKEN=addef702ba1c2fa4fcbee084df91ed3a
PUBLIC_STOREFRONT_ID=1000165249
SESSION_SECRET=5894f0bdb2351f9684411c11c436399f0e6ae688
```

### 4. Run Development Server
```bash
npm run dev
```

---

## 🚢 Production Deployment

### Deploying to Vercel (Edge SSR)
The project includes a pre-configured [vercel.json](file:///d:/shopify/new-hydrozen/vercel.json) and [api/index.js](file:///d:/shopify/new-hydrozen/api/index.js) Edge handler.

1. Push changes to GitHub.
2. Import repository into [Vercel](https://vercel.com).
3. Set your environment variables in Vercel Project Settings.
4. Deploy!

### Deploying to Shopify Oxygen
```bash
npx shopify hydrogen deploy
```

---

## 📄 License
This project is private and maintained for TimeCrafts / Priyo Ghosh.
