# Expert Review Hub

Single Backend + Single Frontend Application

## � Quick Start (5 minutes)

### 1️⃣ Prerequisites
- Node.js v18+ ([Download](https://nodejs.org/))
- PostgreSQL ([Download](https://www.postgresql.org/))

### 2️⃣ Backend
```bash
cd backend
npm install

# Create .env file
cat > .env << EOF
DATABASE_URL=postgresql://user:password@localhost:5432/expert_review_hub
JWT_SECRET=your-secret-key-here
PORT=3000
EOF

npm run dev
```
✅ Backend: `http://localhost:3000`

### 3️⃣ Frontend
```bash
cd frontend
npm install

# Create .env file
cat > .env << EOF
VITE_API_URL=http://localhost:3000
EOF

npm run dev
```
✅ Frontend: `http://localhost:5173`

---

## 📁 Structure

```
.
├── backend/       ← Node.js + Express API
├── frontend/      ← React + Vite web app
└── README.md
```

## 📚 Full Setup Guide

See **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** for detailed instructions.

## 🛠️ Tech Stack

- **Backend**: Node.js, Express, PostgreSQL, Drizzle, TypeScript
- **Frontend**: React 19, Vite, Tailwind, Radix UI, TypeScript

## 📝 Backend Scripts

```bash
npm run dev       # Development (auto-restart)
npm run build     # Build for production
npm run start     # Run production build
npm run typecheck # TypeScript check
```

## 📝 Frontend Scripts

```bash
npm run dev       # Development
npm run build     # Build for production
npm run preview   # Preview production
npm run typecheck # TypeScript check
```

## ✨ Features

- ✅ Clean, simple structure
- ✅ Independent backend & frontend
- ✅ Full TypeScript support
- ✅ SOLID principles enforced
- ✅ Production ready

---

**Ready to develop!** 🎉

See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed setup and troubleshooting.
