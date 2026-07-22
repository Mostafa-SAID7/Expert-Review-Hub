import { Router } from "express";
import { db, recipesTable } from "../db/index.js";
import { eq, ilike, and, sql, type SQL } from "drizzle-orm";

const router = Router();

router.get("/recipes", async (req, res) => {
  const { category, goal, search } = req.query as Record<string, string>;
  const conditions: SQL[] = [];
  if (category) conditions.push(eq(recipesTable.category, category));
  if (goal) conditions.push(eq(recipesTable.goal, goal));
  if (search) {
    conditions.push(
      sql`(${ilike(recipesTable.title, `%${search}%`)} OR ${ilike(recipesTable.titleAr, `%${search}%`)})`
    );
  }
  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
  const recipes = await db.select().from(recipesTable).where(whereClause);
  return res.json(recipes);
});

router.get("/recipes/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });

  const [recipe] = await db.select().from(recipesTable).where(eq(recipesTable.id, id)).limit(1);
  if (!recipe) return res.status(404).json({ error: "Recipe not found" });
  return res.json(recipe);
});

export default router;
