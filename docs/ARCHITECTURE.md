# Architecture — Expert Review Hub

This document describes the system design, data models, and key architectural decisions made during the refactoring of Expert Review Hub.

---

## System Overview

```
Browser (React SPA)
       │
       │  HTTP / JSON
       ▼
Express REST API  ──── PostgreSQL
  (Node.js / TS)         (Drizzle ORM)
       │
       ▼ (Vercel serverless)
  api/index.ts
```

The app follows a **monorepo** layout: one repo, two independently deployable services (`frontend/`, `backend/`) coordinated via `vercel.json` at the root.

---

## Backend Architecture

### Layer Structure

```
Request → Route → Middleware → Controller → Service/Repository → DB
                                         ↑
                                     Zod Validator
```

| Layer | Folder | Responsibility |
|---|---|---|
| **Routes** | `src/routes/` | URL → controller mapping |
| **Middleware** | `src/middleware/` | Auth guard (`auth.ts`), error handler |
| **Controllers** | `src/controllers/` | Handle req/res, call services |
| **Services** | `src/services/` | Business logic, base repository |
| **DB / Schema** | `src/db/schema/` | Drizzle table definitions |
| **Validators** | `src/validators/` | Zod schemas for request bodies |
| **Config** | `src/config/` | Env vars, centralized validation |
| **Errors** | `src/errors/` | Typed HTTP error classes |
| **Lib** | `src/lib/` | Logger (Pino), shared utilities |

### Key Design Decisions

- **SOLID principles** — controllers are thin; business logic lives in services
- **Repository pattern** — `src/services/repository.ts` abstracts DB queries
- **Centralized env** — `src/config/env.ts` validates all environment variables at startup; the app fails fast in production if required vars are missing
- **Structured logging** — Pino with per-request serializers (no sensitive data in logs)
- **OpenAPI spec** — `src/openapi.yaml` is the source of truth; Orval generates typed client hooks from it

---

## Frontend Architecture

### Layer Structure

```
Pages
  └── Components (Shadcn/UI + custom)
        ├── hooks/         # Data fetching (TanStack Query) + auth
        ├── contexts/      # Global state (theme, language, notifications)
        ├── lib/axios.ts   # Configured Axios instance
        └── types/         # Shared API response types
```

| Folder | Responsibility |
|---|---|
| `pages/` | Full-page React components (routes) |
| `components/` | Reusable UI (Shadcn primitives + custom) |
| `hooks/` | `useAuth`, data query/mutation wrappers |
| `contexts/` | `ThemeProvider`, `LangProvider`, `NotificationsProvider` |
| `constants/` | API endpoint strings, query keys |
| `utils/` | Date helpers, number formatters |
| `types/` | TypeScript interfaces mirroring API responses |

### Routing

[Wouter](https://github.com/molefrog/wouter) is used instead of React Router — it is smaller, zero-dependency, and supports a `base` prop for Vercel path-based routing.

```
/              → Home
/login         → Login
/register      → Register
/guide         → Guide
/dashboard     → Dashboard
/tracker       → Food Tracker
/plans         → Meal Plans
/recipes       → Recipes
/profile       → Profile
```

### State Management

| Concern | Solution |
|---|---|
| Server state | TanStack Query (caching, refetch, mutations) |
| Auth state | React Context + `useAuth` hook |
| UI theme | `ThemeProvider` (context + `localStorage`) |
| Language | `LangProvider` (context) |
| Notifications | `NotificationsProvider` (context + toast) |

---

## Database Schema

### `users`
| Column | Type | Notes |
|---|---|---|
| `id` | serial PK | |
| `email` | varchar(255) | unique |
| `password_hash` | text | bcrypt |
| `name` | varchar(100) | |
| `created_at` | timestamp | |

### `profiles`
| Column | Type | Notes |
|---|---|---|
| `id` | serial PK | |
| `user_id` | FK → users | 1:1 |
| `age` | integer | |
| `weight` | numeric | kg |
| `height` | numeric | cm |
| `goal` | varchar | `lose_weight` \| `gain_muscle` \| `maintain` |
| `activity_level` | varchar | `sedentary` \| `light` \| `moderate` \| `active` |

### `foods`
| Column | Type | Notes |
|---|---|---|
| `id` | serial PK | |
| `name` | varchar(255) | |
| `calories` | numeric | per serving |
| `protein` | numeric | grams |
| `carbs` | numeric | grams |
| `fat` | numeric | grams |
| `created_by` | FK → users | null = system food |

### `tracker`
| Column | Type | Notes |
|---|---|---|
| `id` | serial PK | |
| `user_id` | FK → users | |
| `food_id` | FK → foods | |
| `date` | date | |
| `meal_type` | varchar | `breakfast` \| `lunch` \| `dinner` \| `snack` |
| `quantity` | numeric | |
| `unit` | varchar | |

### `plans`
| Column | Type | Notes |
|---|---|---|
| `id` | serial PK | |
| `user_id` | FK → users | |
| `name` | varchar(255) | |
| `start_date` | date | |
| `end_date` | date | |
| `target_calories` | integer | |

### `recipes`
| Column | Type | Notes |
|---|---|---|
| `id` | serial PK | |
| `user_id` | FK → users | |
| `name` | varchar(255) | |
| `description` | text | |
| `servings` | integer | |
| `instructions` | text | |

---

## Deployment Architecture

```
Vercel Edge Network
       │
  vercel.json (rewrites)
       ├── /api/*  → backend (Node.js serverless)
       └── /*      → frontend (Vite static assets)
```

The `backend/api/index.ts` file wraps the Express app for Vercel's serverless runtime. The backend `drizzle.config.ts` uses the `DATABASE_URL` environment variable — set this in Vercel project settings.
