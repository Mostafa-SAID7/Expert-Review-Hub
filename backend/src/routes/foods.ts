import { Router } from "express";
import { db } from "@workspace/db";
import { foodsTable } from "@workspace/db";
import { eq, ilike, and, sql } from "drizzle-orm";
import type { AuthRequest } from "../middlewares/auth";

const router = Router();

router.get("/foods", async (req: AuthRequest, res) => {
  const { category, status, search, page = "1", limit = "20" } = req.query as Record<string, string>;
  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
  const offset = (pageNum - 1) * limitNum;

  const conditions = [];
  if (category) conditions.push(eq(foodsTable.category, category));
  if (status === "tayyib" || status === "khabeeth") {
    conditions.push(eq(foodsTable.status, status));
  }
  if (search) {
    conditions.push(
      sql`(${ilike(foodsTable.name, `%${search}%`)} OR ${ilike(foodsTable.nameAr, `%${search}%`)})`
    );
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
  const [items, countResult] = await Promise.all([
    db.select().from(foodsTable).where(whereClause).limit(limitNum).offset(offset),
    db.select({ count: sql<number>`count(*)::int` }).from(foodsTable).where(whereClause),
  ]);

  return res.json({
    items,
    total: countResult[0]?.count ?? 0,
    page: pageNum,
    limit: limitNum,
  });
});

router.get("/foods/categories", async (_req, res) => {
  const rows = await db
    .select({
      category: foodsTable.category,
      status: foodsTable.status,
      count: sql<number>`count(*)::int`,
    })
    .from(foodsTable)
    .groupBy(foodsTable.category, foodsTable.status);

  const map = new Map<string, { name: string; nameAr: string; tayyibCount: number; khabeethCount: number }>();
  for (const row of rows) {
    if (!map.has(row.category)) {
      map.set(row.category, { name: row.category, nameAr: row.category, tayyibCount: 0, khabeethCount: 0 });
    }
    const entry = map.get(row.category)!;
    if (row.status === "tayyib") entry.tayyibCount = row.count;
    else entry.khabeethCount = row.count;
  }

  return res.json(Array.from(map.values()));
});

router.get("/foods/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });

  const [food] = await db.select().from(foodsTable).where(eq(foodsTable.id, id)).limit(1);
  if (!food) return res.status(404).json({ error: "Food not found" });
  return res.json(food);
});

export default router;
