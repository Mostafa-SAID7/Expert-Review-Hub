# Expert Review Hub

Single Backend + Single Frontend Application

## 📁 Structure

```
.
├── .git/          ← Version control
├── backend/       ← Node.js + Express API
├── frontend/      ← React + Vite web app
└── .gitignore
```

## 🚀 Quick Start

### Backend
```bash
cd backend
npm install
npm run dev       # Development mode
npm run build     # Build for production
npm run start     # Run production build
```

**Backend runs on:** `http://localhost:3000`

### Frontend
```bash
cd frontend
npm install
npm run dev       # Development mode (Vite)
npm run build     # Build for production
npm run preview   # Preview production build
```

**Frontend runs on:** `http://localhost:5173`

## 🛠️ Tech Stack

### Backend
- Node.js + Express
- PostgreSQL + Drizzle ORM
- TypeScript
- Zod validation

### Frontend
- React 19 + Vite
- Tailwind CSS
- Radix UI components
- TypeScript

## 📝 Environment

### Backend (.env in backend/)
```
DATABASE_URL=postgresql://user:password@localhost/expert_review_hub
SESSION_SECRET=your-secret-key
PORT=3000
```

### Frontend (.env in frontend/)
```
VITE_API_URL=http://localhost:3000
```

## ✅ Features

- ✅ Clean, simple structure (no monorepo complexity)
- ✅ Each app is completely independent
- ✅ Backend and frontend can be deployed separately
- ✅ Full TypeScript support
- ✅ SOLID principles enforced in backend

## 📚 Development

Each folder is a complete standalone application with its own:
- `package.json` - Dependencies and scripts
- `tsconfig.json` - TypeScript configuration
- `src/` - Source code
- `dist/` - Build output

## 🚢 Deployment

### Deploy Backend
```bash
cd backend
npm install
npm run build
npm run start
```

### Deploy Frontend
```bash
cd frontend
npm install
npm run build
# Upload dist/ to web server
```

---

**Ready to develop!** 🎉
