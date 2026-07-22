<div align="center">

# 🥗 Expert Review Hub

**A full-stack nutrition & wellness platform — track meals, manage plans, discover recipes, and reach your health goals.**

[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Drizzle_ORM-336791?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

[📖 Docs](./docs/) · [🚀 Setup Guide](./docs/SETUP.md) · [🔌 API Reference](./docs/API.md) · [🤝 Contributing](./CONTRIBUTING.md)

</div>

---

## ✨ Features

| Area | What's Included |
|---|---|
| 🔐 **Auth** | JWT-based register / login / logout with secure HTTP cookies |
| 📊 **Dashboard** | Macro overview, calorie progress, and daily summary cards |
| 🍽️ **Food Tracker** | Log meals per day, search foods, track macros (protein, carbs, fat) |
| 📅 **Meal Plans** | Create, assign, and follow structured weekly meal plans |
| 🧑‍🍳 **Recipes** | Browse, create, and save community recipes with full nutrition info |
| 👤 **Profile** | Personal stats, goals, and preferences management |
| 🌙 **Dark Mode** | Full light/dark theme with system preference detection |
| 🌍 **i18n Ready** | Multi-language context built in |
| 📱 **PWA** | Installable as a Progressive Web App |

---

## 🏗️ Architecture

```
Expert-Review-Hub/
├── backend/                   # Node.js + Express REST API
│   ├── api/                   # Vercel serverless entry (index.ts)
│   ├── src/
│   │   ├── app.ts             # Express app setup (CORS, logging, routes)
│   │   ├── index.ts           # Server entry + graceful shutdown
│   │   ├── config/            # Centralized env config & validation
│   │   ├── controllers/       # Route handlers (auth, dashboard, foods, …)
│   │   ├── db/
│   │   │   ├── schema/        # Drizzle ORM schemas (users, foods, tracker, …)
│   │   │   ├── seeds/         # Seed scripts for development data
│   │   │   └── index.ts       # DB connection pool
│   │   ├── errors/            # Typed error classes
│   │   ├── lib/               # Logger (Pino) & shared utilities
│   │   ├── middleware/        # Auth guard, error handler
│   │   ├── models/            # Data-shape types / DTOs
│   │   ├── routes/            # Route definitions (auth, foods, tracker, …)
│   │   ├── services/          # Base service + repository pattern
│   │   ├── types/             # Global TypeScript types
│   │   ├── utils/             # Helpers (hashing, JWT, …)
│   │   ├── validators/        # Zod request validators
│   │   └── openapi.yaml       # OpenAPI 3.1 spec (auto-generated)
│   ├── drizzle.config.ts      # Drizzle Kit configuration
│   ├── tsconfig.json
│   └── package.json
│
├── frontend/                  # React 19 + Vite SPA
│   ├── src/
│   │   ├── App.tsx            # Root router (Wouter)
│   │   ├── components/        # Shadcn/UI + custom components
│   │   ├── constants/         # API endpoints, query keys
│   │   ├── contexts/          # Theme, language, notifications
│   │   ├── hooks/             # useAuth, useQuery wrappers
│   │   ├── lib/               # Axios client, cn utility
│   │   ├── pages/             # Home, Dashboard, Tracker, MealPlans, Recipes, …
│   │   ├── types/             # Shared API response types
│   │   └── utils/             # Date helpers, formatters
│   ├── vite.config.ts
│   ├── tsconfig.json
│   └── package.json
│
├── docs/                      # Project documentation
├── vercel.json                # Vercel monorepo deployment config
├── .gitignore
└── README.md
```

---

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| **Node.js + Express 5** | HTTP server & routing |
| **TypeScript 5.9** | Type safety |
| **Drizzle ORM** | Type-safe PostgreSQL queries & migrations |
| **PostgreSQL** | Primary database |
| **Pino** | Structured JSON logging |
| **Zod** | Runtime schema & request validation |
| **JWT + bcryptjs** | Authentication & password hashing |
| **OpenAPI / Orval** | API spec & auto-generated client types |

### Frontend
| Technology | Purpose |
|---|---|
| **React 19** | UI framework |
| **Vite 7** | Dev server & bundler |
| **Tailwind CSS v4** | Utility-first styling |
| **Shadcn/UI + Radix UI** | Accessible component primitives |
| **Wouter** | Lightweight client-side router |
| **TanStack Query v5** | Server state management & caching |
| **Framer Motion** | Animations & transitions |
| **Recharts** | Dashboard charts |
| **React Hook Form + Zod** | Forms & validation |
| **Axios** | HTTP client |

---

## 🚀 Quick Start

> **Prerequisites:** Node.js ≥ 18, PostgreSQL running locally

### 1. Clone & Install

```bash
git clone https://github.com/Mostafa-SAID7/Expert-Review-Hub.git
cd Expert-Review-Hub
```

### 2. Backend Setup

```bash
cd backend
npm install

# Copy env template
cp .env.example .env
# Edit .env and set your DATABASE_URL and JWT_SECRET

# Push schema to your database
npx drizzle-kit push

# Start dev server
npm run dev
```

✅ API running at **`http://localhost:3000`**

### 3. Frontend Setup

```bash
cd ../frontend
npm install

# Create frontend env
echo "VITE_API_URL=http://localhost:3000" > .env

npm run dev
```

✅ App running at **`http://localhost:5173`**

---

## 📝 Scripts

### Backend (`/backend`)

```bash
npm run dev        # Start development server with hot-reload (tsx watch)
npm run build      # Compile TypeScript → dist/
npm run start      # Run production build
npm run typecheck  # Run tsc type-check (no emit)
```

### Frontend (`/frontend`)

```bash
npm run dev        # Vite development server
npm run build      # Production bundle
npm run preview    # Preview production build locally
npm run typecheck  # Run tsc type-check (no emit)
```

### Database (`/backend`)

```bash
npx drizzle-kit generate   # Generate SQL migration files
npx drizzle-kit push       # Push schema directly to DB (dev)
npx drizzle-kit migrate    # Run migrations
npx drizzle-kit studio     # Open Drizzle Studio (visual DB browser)
```

---

## 🌐 API Routes

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | ❌ | Create account |
| `POST` | `/api/auth/login` | ❌ | Sign in |
| `POST` | `/api/auth/logout` | ✅ | Sign out |
| `GET` | `/api/dashboard` | ✅ | Dashboard summary |
| `GET/POST` | `/api/tracker` | ✅ | Food log entries |
| `GET/POST` | `/api/plans` | ✅ | Meal plans |
| `GET/POST` | `/api/recipes` | ✅ | Recipes |
| `GET/POST` | `/api/foods` | ✅ | Food database |
| `GET/PUT` | `/api/profile` | ✅ | User profile |
| `GET` | `/api/health` | ❌ | Health check |

See [📖 API Reference](./docs/API.md) for full request/response schemas.

---

## 🚢 Deployment

The project is configured for **Vercel** monorepo deployment via [`vercel.json`](./vercel.json):

- Frontend → Vite static build
- Backend → Serverless function via `backend/api/index.ts`
- All `/api/*` traffic is routed to the backend service

```bash
# Deploy with Vercel CLI
npx vercel --prod
```

See [📖 Deployment Guide](./docs/DEPLOYMENT.md) for full instructions.

---

## 📚 Documentation

| Document | Description |
|---|---|
| [SETUP.md](./docs/SETUP.md) | Detailed local dev setup & troubleshooting |
| [API.md](./docs/API.md) | Full REST API reference |
| [ARCHITECTURE.md](./docs/ARCHITECTURE.md) | System design & data models |
| [DEPLOYMENT.md](./docs/DEPLOYMENT.md) | Deployment to Vercel & other platforms |

---

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](./CONTRIBUTING.md) and follow the [Code of Conduct](./CODE_OF_CONDUCT.md).

1. Fork the repo
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Commit changes: `git commit -m "feat: add your feature"`
4. Push: `git push origin feat/your-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** — see [LICENSE](./LICENSE) for details.

---

<div align="center">

Built with ❤️ by [Mostafa SAID](https://github.com/Mostafa-SAID7)

</div>
