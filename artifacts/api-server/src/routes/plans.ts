import { Router } from "express";
import { db } from "@workspace/db";
import { mealPlansTable, mealPlanEntriesTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { requireAuth, type AuthRequest } from "../middlewares/auth";
import { CreateMealPlanBody, UpdateMealPlanBody } from "@workspace/api-zod";

const router = Router();
router.use(requireAuth);

async function getPlanWithEntries(planId: number, userId: number) {
  const [plan] = await db.select().from(mealPlansTable)
    .where(and(eq(mealPlansTable.id, planId), eq(mealPlansTable.userId, userId))).limit(1);
  if (!plan) return null;
  const entries = await db.select().from(mealPlanEntriesTable).where(eq(mealPlanEntriesTable.planId, planId));
  return { ...plan, entries };
}

router.get("/plans", async (req: AuthRequest, res) => {
  const plans = await db.select().from(mealPlansTable).where(eq(mealPlansTable.userId, req.userId!));
  const withEntries = await Promise.all(plans.map(async (p) => {
    const entries = await db.select().from(mealPlanEntriesTable).where(eq(mealPlanEntriesTable.planId, p.id));
    return { ...p, entries };
  }));
  return res.json(withEntries);
});

router.post("/plans", async (req: AuthRequest, res) => {
  const parsed = CreateMealPlanBody.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid input" });

  const [plan] = await db.insert(mealPlansTable).values({ ...parsed.data, userId: req.userId! }).returning();
  return res.status(201).json({ ...plan, entries: [] });
});

router.get("/plans/:id", async (req: AuthRequest, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });

  const plan = await getPlanWithEntries(id, req.userId!);
  if (!plan) return res.status(404).json({ error: "Plan not found" });
  return res.json(plan);
});

router.patch("/plans/:id", async (req: AuthRequest, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });

  const parsed = UpdateMealPlanBody.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid input" });

  const [updated] = await db.update(mealPlansTable)
    .set(parsed.data)
    .where(and(eq(mealPlansTable.id, id), eq(mealPlansTable.userId, req.userId!)))
    .returning();
  if (!updated) return res.status(404).json({ error: "Plan not found" });

  const entries = await db.select().from(mealPlanEntriesTable).where(eq(mealPlanEntriesTable.planId, id));
  return res.json({ ...updated, entries });
});

router.delete("/plans/:id", async (req: AuthRequest, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });

  await db.delete(mealPlanEntriesTable).where(eq(mealPlanEntriesTable.planId, id));
  await db.delete(mealPlansTable).where(and(eq(mealPlansTable.id, id), eq(mealPlansTable.userId, req.userId!)));
  return res.status(204).send();
});

export default router;
