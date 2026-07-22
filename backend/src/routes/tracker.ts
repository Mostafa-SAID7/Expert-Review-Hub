import { Router } from "express";
import { db } from "@workspace/db";
import { trackerEntriesTable, weightLogsTable } from "@workspace/db";
import { eq, and, gte, lte, sql, desc } from "drizzle-orm";
import { requireAuth, type AuthRequest } from "../middleware/auth";
import { CreateTrackerEntryBody, UpdateTrackerEntryBody, CreateWeightLogBody } from "@workspace/api-zod";

const router = Router();

router.use(requireAuth);

router.get("/tracker/entries", async (req: AuthRequest, res) => {
  const { startDate, endDate } = req.query as Record<string, string>;
  const userId = req.userId!;

  const conditions = [eq(trackerEntriesTable.userId, userId)];
  if (startDate) conditions.push(gte(trackerEntriesTable.date, startDate));
  if (endDate) conditions.push(lte(trackerEntriesTable.date, endDate));

  const entries = await db.select().from(trackerEntriesTable).where(and(...conditions)).orderBy(desc(trackerEntriesTable.createdAt));
  return res.json(entries);
});

router.post("/tracker/entries", async (req: AuthRequest, res) => {
  const parsed = CreateTrackerEntryBody.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid input" });

  const [entry] = await db.insert(trackerEntriesTable).values({ ...parsed.data, userId: req.userId! }).returning();
  return res.status(201).json(entry);
});

router.patch("/tracker/entries/:id", async (req: AuthRequest, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });

  const parsed = UpdateTrackerEntryBody.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid input" });

  const [entry] = await db.update(trackerEntriesTable)
    .set(parsed.data)
    .where(and(eq(trackerEntriesTable.id, id), eq(trackerEntriesTable.userId, req.userId!)))
    .returning();

  if (!entry) return res.status(404).json({ error: "Entry not found" });
  return res.json(entry);
});

router.delete("/tracker/entries/:id", async (req: AuthRequest, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });

  await db.delete(trackerEntriesTable)
    .where(and(eq(trackerEntriesTable.id, id), eq(trackerEntriesTable.userId, req.userId!)));
  return res.status(204).send();
});

router.get("/tracker/today", async (req: AuthRequest, res) => {
  const userId = req.userId!;
  const today = new Date().toISOString().split("T")[0];

  const entries = await db.select().from(trackerEntriesTable)
    .where(and(eq(trackerEntriesTable.userId, userId), eq(trackerEntriesTable.date, today)));

  const meals = entries.filter(e => e.type === "meal");
  const tayyibCount = meals.filter(e => e.foodStatus === "tayyib").length;
  const khabeethCount = meals.filter(e => e.foodStatus === "khabeeth").length;
  const waterEntries = entries.filter(e => e.type === "water");
  const waterMl = waterEntries.reduce((sum, e) => sum + (e.waterMl ?? 0), 0);
  const fastingEntries = entries.filter(e => e.type === "fasting");
  const fastingHours = fastingEntries.reduce((sum, e) => sum + (e.fastingHours ?? 0), 0);
  const hungerValues = meals.map(e => e.hungerLevel).filter(Boolean) as number[];
  const energyValues = meals.map(e => e.energyLevel).filter(Boolean) as number[];
  const avgHunger = hungerValues.length ? hungerValues.reduce((a, b) => a + b, 0) / hungerValues.length : 0;
  const avgEnergy = energyValues.length ? energyValues.reduce((a, b) => a + b, 0) / energyValues.length : 0;
  const adherence = meals.length > 0 ? Math.round((tayyibCount / meals.length) * 100) : 0;

  return res.json({
    date: today,
    mealCount: meals.length,
    tayyibCount,
    khabeethCount,
    waterMl,
    fastingHours,
    averageHunger: Math.round(avgHunger * 10) / 10,
    averageEnergy: Math.round(avgEnergy * 10) / 10,
    adherenceScore: adherence,
  });
});

router.get("/tracker/weight", async (req: AuthRequest, res) => {
  const { days = "30" } = req.query as Record<string, string>;
  const daysNum = parseInt(days);
  const since = new Date();
  since.setDate(since.getDate() - daysNum);
  const sinceStr = since.toISOString().split("T")[0];

  const logs = await db.select().from(weightLogsTable)
    .where(and(eq(weightLogsTable.userId, req.userId!), gte(weightLogsTable.date, sinceStr)))
    .orderBy(weightLogsTable.date);

  return res.json(logs);
});

router.post("/tracker/weight", async (req: AuthRequest, res) => {
  const parsed = CreateWeightLogBody.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid input" });

  const [log] = await db.insert(weightLogsTable).values({ ...parsed.data, userId: req.userId! }).returning();
  return res.status(201).json(log);
});

export default router;
