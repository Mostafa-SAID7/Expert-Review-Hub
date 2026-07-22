# Setup Guide - Running Backend & Frontend

## Prerequisites

Make sure you have installed:
- **Node.js** (v18+) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **PostgreSQL** - [Download](https://www.postgresql.org/download/)

Verify installation:
```bash
node --version    # Should show v18+
npm --version     # Should show v9+
postgres --version
```

---

## 🗄️ Step 1: Setup PostgreSQL Database

### Create Database
```bash
# On Windows, open PostgreSQL command line (psql):
# Or use pgAdmin GUI

# Run these SQL commands:
CREATE DATABASE expert_review_hub;
CREATE USER app_user WITH PASSWORD 'your_secure_password';
ALTER ROLE app_user SET client_encoding TO 'utf8';
ALTER ROLE app_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE app_user SET default_transaction_deferrable TO on;
ALTER ROLE app_user SET default_transaction_read_only TO off;
GRANT ALL PRIVILEGES ON DATABASE expert_review_hub TO app_user;
```

---

## 📦 Step 2: Backend Setup

### Install Dependencies
```bash
cd backend
npm install
```

### Create .env File
Create `backend/.env`:
```
DATABASE_URL=postgresql://app_user:your_secure_password@localhost:5432/expert_review_hub
SESSION_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=3000
NODE_ENV=development
```

### Run Database Migrations
```bash
# Run Drizzle migrations (if needed)
npm run db:migrate    # Or check your migration script
```

### Start Backend
```bash
npm run dev
```

✅ Backend should be running at: `http://localhost:3000`

Check if it's working:
```bash
curl http://localhost:3000/health
```

---

## 🎨 Step 3: Frontend Setup

### Install Dependencies
```bash
cd frontend
npm install
```

### Create .env File
Create `frontend/.env`:
```
VITE_API_URL=http://localhost:3000
```

### Start Frontend
```bash
npm run dev
```

✅ Frontend should be running at: `http://localhost:5173`

---

## 🚀 Running Both Apps (Recommended Setup)

### Option 1: Two Terminal Windows

**Terminal 1 - Backend:**
```bash
cd Expert-Review-Hub/backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd Expert-Review-Hub/frontend
npm run dev
```

### Option 2: Using VS Code Integrated Terminal

1. Open VS Code
2. Open Terminal (Ctrl + `)
3. Split terminal (Ctrl + Shift + 5)
4. In left terminal: `cd backend && npm run dev`
5. In right terminal: `cd frontend && npm run dev`

### Option 3: Using npm-run-all (Optional)

In root directory, create a simple script to run both:
```bash
# Create start-all.sh (Linux/Mac)
#!/bin/bash
cd backend && npm run dev &
cd frontend && npm run dev &
wait
```

---

## ✅ Verification Checklist

- [ ] Node.js and npm installed
- [ ] PostgreSQL running and database created
- [ ] Backend dependencies installed
- [ ] Backend .env configured
- [ ] Backend starts without errors (`npm run dev`)
- [ ] Backend health check works (`curl http://localhost:3000/health`)
- [ ] Frontend dependencies installed
- [ ] Frontend .env configured
- [ ] Frontend starts without errors (`npm run dev`)
- [ ] Frontend accessible at `http://localhost:5173`

---

## 🧪 Testing the Connection

### Test Backend API
```bash
# Health check
curl http://localhost:3000/health

# Register user
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","password":"TestPass123"}'
```

### Test Frontend
1. Open browser: `http://localhost:5173`
2. You should see the app loading
3. Try logging in or registering

---

## 🐛 Troubleshooting

### Backend Issues

**Error: `PORT 3000 already in use`**
```bash
# Change PORT in backend/.env to something else (e.g., 3001)
# Or kill the process using port 3000
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac:
lsof -i :3000
kill -9 <PID>
```

**Error: `DATABASE_URL not found`**
- Make sure `backend/.env` exists
- Check database URL is correct
- Verify PostgreSQL is running

**Error: `Cannot find module`**
```bash
cd backend
rm -rf node_modules
npm install
```

---

### Frontend Issues

**Error: `VITE_API_URL not found`**
- Make sure `frontend/.env` exists
- Should point to backend URL (http://localhost:3000)

**Port 5173 already in use**
```bash
# Vite will automatically use next available port
# Or kill the process:
# Windows:
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

**Cannot connect to backend**
- Verify backend is running: `curl http://localhost:3000/health`
- Check `VITE_API_URL` in `frontend/.env`
- Check CORS is enabled in backend

---

## 📝 Backend Scripts

```bash
npm run dev         # Development mode (auto-restart)
npm run build       # Build for production
npm run start       # Run production build
npm run typecheck   # Check TypeScript types
```

---

## 📝 Frontend Scripts

```bash
npm run dev         # Development mode (Vite)
npm run build       # Build for production
npm run preview     # Preview production build
npm run typecheck   # Check TypeScript types
```

---

## 🎯 Next Steps

Once both apps are running:

1. **Backend**: Explore API routes in `backend/src/routes/`
2. **Frontend**: Explore components in `frontend/src/components/`
3. **Database**: Check schema in `backend/src/db/schema/`
4. **Types**: Check types in `backend/src/types/` and `frontend/src/types/`

---

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)

---

## ✨ You're Ready!

Both apps should now be running and communicating. Start developing! 🚀
