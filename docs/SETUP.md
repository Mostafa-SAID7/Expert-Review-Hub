# Setup Guide — Expert Review Hub

A step-by-step guide to get the project running locally, including database setup, environment variables, and common troubleshooting tips.

---

## Prerequisites

| Tool | Version | Install |
|---|---|---|
| **Node.js** | ≥ 18 LTS | [nodejs.org](https://nodejs.org/) |
| **npm** | ≥ 9 | Included with Node.js |
| **PostgreSQL** | ≥ 14 | [postgresql.org](https://www.postgresql.org/) |
| **Git** | Any | [git-scm.com](https://git-scm.com/) |

---

## 1. Clone the Repository

```bash
git clone https://github.com/Mostafa-SAID7/Expert-Review-Hub.git
cd Expert-Review-Hub
```

---

## 2. Database Setup

### Create the PostgreSQL database

```sql
-- In psql or a GUI like pgAdmin / DBeaver
CREATE DATABASE expert_review_hub;
```

### Note your connection string

```
postgresql://<user>:<password>@<host>:<port>/expert_review_hub
```

Example (local default):
```
postgresql://postgres:postgres@localhost:5432/expert_review_hub
```

---

## 3. Backend Setup

```bash
cd backend
npm install
```

### Environment variables

```bash
cp .env.example .env
```

Open `.env` and fill in your values:

```env
NODE_ENV=development
PORT=3000

# Your PostgreSQL connection string
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/expert_review_hub

# Generate a strong random secret (e.g. `openssl rand -hex 32`)
JWT_SECRET=your-very-long-random-secret

JWT_EXPIRES_IN=7d

# Allow the frontend dev server origin
CORS_ORIGIN=http://localhost:5173

LOG_LEVEL=info
```

### Push the database schema

This command syncs the Drizzle ORM schema to your database (creates all tables):

```bash
npx drizzle-kit push
```

### (Optional) Seed sample data

```bash
npx tsx src/db/seeds/users.seed.ts
```

### Start the development server

```bash
npm run dev
```

✅ API is running at **http://localhost:3000**

Verify with:
```bash
curl http://localhost:3000/api/health
# {"status":"ok","timestamp":"..."}
```

---

## 4. Frontend Setup

```bash
cd ../frontend
npm install
```

### Environment variables

Create a `.env` file in the `frontend/` directory:

```env
VITE_API_URL=http://localhost:3000
```

### Start the development server

```bash
npm run dev
```

✅ App is running at **http://localhost:5173**

---

## 5. Verifying Everything Works

1. Open **http://localhost:5173** in your browser
2. Click **Register** and create an account
3. Log in — you should land on the Dashboard
4. Navigate to **Tracker**, **Meal Plans**, **Recipes** to verify each section loads

---

## 6. Database Management

| Command | Description |
|---|---|
| `npx drizzle-kit push` | Push schema changes to DB (dev) |
| `npx drizzle-kit generate` | Generate SQL migration files |
| `npx drizzle-kit migrate` | Run pending migrations |
| `npx drizzle-kit studio` | Open visual DB browser at localhost:4983 |

---

## 7. Troubleshooting

### `Cannot connect to database`
- Make sure PostgreSQL is running: `pg_ctl status` or check Services on Windows
- Verify `DATABASE_URL` is correct in `backend/.env`
- Ensure the database exists: `psql -U postgres -c "\l"`

### `JWT_SECRET` error in production
- The app requires `JWT_SECRET` to be set when `NODE_ENV=production`
- Generate one: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

### `process is not defined` TypeScript error
- Ensure `drizzle.config.ts` is in the `include` array in `backend/tsconfig.json`
- Run `npm run typecheck` to verify

### Port conflicts
- Backend default: **3000** — change with `PORT=` in `backend/.env`
- Frontend default: **5173** — change with `--port` flag or in `vite.config.ts`

### `Cannot find module` errors on Windows
- Make sure you're running `npm install` inside the correct directory (`backend/` or `frontend/`)
- Try deleting `node_modules` and running `npm install` again

---

## 8. VS Code Recommended Extensions

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "mtxr.sqltools",
    "mtxr.sqltools-driver-pg",
    "drizzle.drizzle-vscode"
  ]
}
```

---

## Next Steps

- [📖 API Reference](./API.md) — Explore all endpoints
- [🏗️ Architecture](./ARCHITECTURE.md) — Understand the system design
- [🚢 Deployment](./DEPLOYMENT.md) — Deploy to production
