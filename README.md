# MythOS Systems Website

**Fighting Big Tech monopolies with digital infrastructure for local economies**

A bold, rebellious website showcasing MythOS Systems' mission to build hyperlocal digital infrastructure. Features a street rebellion meets industrial brutalism aesthetic with WebGL backgrounds, React components, and Tailwind CSS.

## 🎨 Design Philosophy

- **Black background** (#0A0A0A) with high-contrast accents
- **Electric blue** (#0047FF), **purple** (#9D4EDD), and **vibrant orange** (#FF4500)
- **Space Grotesk** and **IBM Plex Sans** typography
- Hard edges, asymmetric grids, and unapologetic design
- No generic SaaS aesthetics

## 🚀 Products

### The Network
Free hyperlocal discovery app launching in Dallas / Fort Worth (October 1, 2026)

### MythOS Pro  
AI-powered business automation at $100/month

## 🛠️ Tech Stack

- **React 18** + **TypeScript**
- **Tailwind CSS v4**
- **Vite**
- **Three.js** (WebGL backgrounds)
- **React Router**
- **Supabase** (backend/database)
- **Motion** (animations)

## 📦 Installation

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev
```

## 🏗️ Project Structure

```
src/
├── app/
│   ├── App.tsx                 # Main application component
│   ├── components/             # Reusable UI components
│   │   ├── Navigation.tsx
│   │   ├── HeroSection.tsx
│   │   ├── modals/            # Modal components
│   │   └── ui/                # shadcn/ui components
│   └── pages/                 # Page components
│       ├── HomePage.tsx
│       ├── ProductsPage.tsx
│       ├── PartnerPage.tsx
│       ├── AboutUsPage.tsx
│       ├── SanDiegoPage.tsx      # retained but hidden (SD launch paused; see App.tsx)
│       └── DFWPage.tsx
├── styles/
│   ├── index.css
│   ├── mythos-theme.css       # Custom theme tokens
│   └── fonts.css
└── supabase/
    └── functions/             # Supabase Edge Functions
```

## 🎯 Features

- **WebGL Backgrounds**: Interactive 3D Neon Flow tubes and animated pattern clouds
- **Responsive Design**: Mobile-optimized with proper touch interactions
- **Partner Integration**: 4 partner types with Supabase backend
- **Modal System**: Early access, affiliate, BID/chamber, investor deck, job applications
- **City Pages**: DFW-specific landing page (San Diego page retained in code but hidden)
- **Investor Portal**: Deck access and investment information

## 🌐 Launch Timeline

- **Dallas / Fort Worth go-live**: October 1, 2026

## 📄 License

Proprietary - MythOS Systems

## 🤝 Contributing

For partnership inquiries, visit [mythos.systems](https://mythos.systems)

---

**Built with rebellion. Powered by Claude Code.**
