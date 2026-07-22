import { Router, type NextFunction, type Request, type Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db, usersTable, userProfilesTable } from "../db/index.js";
import { eq } from "drizzle-orm";
import { RegisterSchema, LoginSchema } from "../validators/schemas.js";
import { env } from "../config/index.js";

const router = Router();

function signToken(userId: number) {
  return jwt.sign({ userId }, env.JWT_SECRET, { expiresIn: "30d" });
}

// ─── Register ────────────────────────────────────────────────────────────────
router.post("/auth/register", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = RegisterSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        error: "Invalid input",
        details: parsed.error.flatten().fieldErrors,
      });
    }
    const { name, email, password } = parsed.data;

    const existing = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .limit(1);

    if (existing.length > 0) {
      return res.status(409).json({ error: "Email already registered" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const [user] = await db
      .insert(usersTable)
      .values({ name, email, passwordHash })
      .returning();

    // Create default profile
    await db
      .insert(userProfilesTable)
      .values({ userId: user.id, goal: "general", language: "ar" });

    const token = signToken(user.id);
    return res.status(201).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl,
        createdAt: user.createdAt,
      },
      token,
    });
  } catch (err) {
    next(err);
  }
});

// ─── Login ───────────────────────────────────────────────────────────────────
router.post("/auth/login", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = LoginSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        error: "Invalid input",
        details: parsed.error.flatten().fieldErrors,
      });
    }
    const { email, password } = parsed.data;

    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .limit(1);

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = signToken(user.id);
    return res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl,
        createdAt: user.createdAt,
      },
      token,
    });
  } catch (err) {
    next(err);
  }
});

// ─── Logout ──────────────────────────────────────────────────────────────────
router.post("/auth/logout", (_req: Request, res: Response) => {
  return res.json({ message: "Logged out" });
});

// ─── Me ──────────────────────────────────────────────────────────────────────
router.get("/auth/me", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    const decoded = jwt.verify(authHeader.slice(7), env.JWT_SECRET) as { userId: number };
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, decoded.userId))
      .limit(1);

    if (!user) return res.status(401).json({ error: "User not found" });

    return res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatarUrl: user.avatarUrl,
      createdAt: user.createdAt,
    });
  } catch (err) {
    // jwt.verify throws on bad/expired token — return 401 not 500
    if (err instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ error: "Invalid token" });
    }
    next(err);
  }
});

export default router;
