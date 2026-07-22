# Deployment Guide — Expert Review Hub

This guide covers deploying Expert Review Hub to Vercel (recommended) and other platforms.

---

## Vercel (Recommended)

The project ships with a `vercel.json` at the root that configures a monorepo deployment — the backend becomes a serverless function and the frontend is served as a static Vite build.

### Steps

1. **Install the Vercel CLI** (optional but useful):
   ```bash
   npm i -g vercel
   ```

2. **Link your project:**
   ```bash
   vercel link
   ```

3. **Set environment variables** in the Vercel dashboard or CLI:
   ```bash
   vercel env add DATABASE_URL production
   vercel env add JWT_SECRET production
   vercel env add CORS_ORIGIN production   # your frontend URL
   vercel env add NODE_ENV production
   vercel env add LOG_LEVEL production
   ```

   For the frontend:
   ```bash
   vercel env add VITE_API_URL production  # your backend URL
   ```

4. **Deploy:**
   ```bash
   vercel --prod
   ```

5. **Run database migrations** after first deploy:
   ```bash
   # From your local machine, pointing at the production DB
   DATABASE_URL="postgresql://..." npx drizzle-kit push
   ```

### How routing works

```
vercel.json rewrites:
  /api/*   →  backend (Node.js serverless via api/index.ts)
  /*       →  frontend (Vite static build)
```

---

## Manual / VPS Deployment

### Backend

```bash
cd backend
npm install --omit=dev
npm run build

# Start with PM2
npm i -g pm2
pm2 start dist/index.mjs --name expert-review-hub-api
pm2 save
```

Set all required environment variables in your VPS environment or a `.env` file.

### Frontend

```bash
cd frontend
npm install
VITE_API_URL=https://your-api-domain.com npm run build
```

The `dist/` folder contains static files — serve them with Nginx, Caddy, or any static host.

**Sample Nginx config:**
```nginx
server {
    listen 80;
    server_name your-frontend-domain.com;
    root /var/www/expert-review-hub/frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

---

## Environment Variables Reference

### Backend

| Variable | Required | Default | Description |
|---|---|---|---|
| `DATABASE_URL` | ✅ | — | PostgreSQL connection string |
| `JWT_SECRET` | ✅ (prod) | `your-secret-key` | JWT signing secret |
| `JWT_EXPIRES_IN` | ❌ | `7d` | Token expiry |
| `PORT` | ❌ | `3000` | HTTP port |
| `NODE_ENV` | ❌ | `development` | `development` \| `production` |
| `CORS_ORIGIN` | ❌ | `http://localhost:5173` | Allowed CORS origin |
| `LOG_LEVEL` | ❌ | `info` | Pino log level |

### Frontend

| Variable | Required | Description |
|---|---|---|
| `VITE_API_URL` | ✅ | Backend base URL |

---

## Database Migrations in Production

Always run migrations before deploying new code that changes the schema:

```bash
# Generate migration SQL (check into source control)
npx drizzle-kit generate

# Apply migrations to production DB
DATABASE_URL="postgresql://..." npx drizzle-kit migrate
```

> ⚠️ Never run `drizzle-kit push` against a production database — it can cause data loss.  
> Use `drizzle-kit migrate` with generated migration files instead.

---

## Health Check

After deploying, verify:

```bash
curl https://your-api-domain.com/api/health
# {"status":"ok","timestamp":"..."}
```
