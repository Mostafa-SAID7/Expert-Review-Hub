import { Router } from "express";
import { db, trackerEntriesTable, weightLogsTable, mealPlansTable, userProfilesTable } from "../db/index.js";
import { eq, and, gte, desc, sql } from "drizzle-orm";
import { requireAuth, type AuthRequest } from "../middleware/auth.js";

const router = Router();
router.use(requireAuth);

router.get("/dashboard/summary", async (req: AuthRequest, res) => {
  const userId = req.userId!;
  const today = new Date().toISOString().split("T")[0];

  // Get total meals
  const [totalResult] = await db.select({ count: sql<number>`count(*)::int` })
    .from(trackerEntriesTable)
    .where(and(eq(trackerEntriesTable.userId, userId), eq(trackerEntriesTable.type, "meal")));

  // Tayyib adherence
  const [tayyibResult] = await db.select({ count: sql<number>`count(*)::int` })
    .from(trackerEntriesTable)
    .where(and(eq(trackerEntriesTable.userId, userId), eq(trackerEntriesTable.type, "meal"), eq(trackerEntriesTable.foodStatus, "tayyib")));

  const totalMeals = totalResult?.count ?? 0;
  const tayyibMeals = tayyibResult?.count ?? 0;
  const adherence = totalMeals > 0 ? Math.round((tayyibMeals / totalMeals) * 100) : 0;

  // Streak: count consecutive days with entries
  const recentDays = await db.select({ date: trackerEntriesTable.date })
    .from(trackerEntriesTable)
    .where(and(eq(trackerEntriesTable.userId, userId), eq(trackerEntriesTable.type, "meal")))
    .groupBy(trackerEntriesTable.date)
    .orderBy(desc(trackerEntriesTable.date))
    .limit(365);

  let currentStreak = 0;
  let longestStreak = 0;
  const dates = recentDays.map(r => r.date).sort().reverse();
  let prev: string | null = null;
  let streak = 0;
  for (const d of dates) {
    if (!prev) { streak = 1; prev = d; continue; }
    const diff = (new Date(prev).getTime() - new Date(d).getTime()) / (1000 * 60 * 60 * 24);
    if (diff === 1) { streak++; }
    else { if (streak > longestStreak) longestStreak = streak; streak = 1; }
    prev = d;
  }
  if (streak > longestStreak) longestStreak = streak;
  if (dates[0] === today || dates[0] === new Date(Date.now() - 86400000).toISOString().split("T")[0]) {
    currentStreak = streak;
  }

  // Water avg last 7 days
  const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString().split("T")[0];
  const waterRows = await db.select({ waterMl: trackerEntriesTable.waterMl })
    .from(trackerEntriesTable)
    .where(and(eq(trackerEntriesTable.userId, userId), eq(trackerEntriesTable.type, "water"), gte(trackerEntriesTable.date, weekAgo)));
  const weeklyWaterAvg = waterRows.length > 0 ? waterRows.reduce((s, r) => s + (r.waterMl ?? 0), 0) / 7 : 0;

  // Current weight
  const [lastWeight] = await db.select().from(weightLogsTable)
    .where(eq(weightLogsTable.userId, userId)).orderBy(desc(weightLogsTable.date)).limit(1);

  // Active plan
  const [activePlan] = await db.select().from(mealPlansTable)
    .where(and(eq(mealPlansTable.userId, userId), eq(mealPlansTable.isActive, true))).limit(1);

  // Profile target weight
  const [profile] = await db.select().from(userProfilesTable).where(eq(userProfilesTable.userId, userId)).limit(1);

  // Recent entries
  const recentEntries = await db.select().from(trackerEntriesTable)
    .where(eq(trackerEntriesTable.userId, userId))
    .orderBy(desc(trackerEntriesTable.createdAt))
    .limit(5);

  return res.json({
    currentStreak,
    longestStreak,
    totalMealsLogged: totalMeals,
    tayyibAdherencePercent: adherence,
    weeklyWaterAvgMl: Math.round(weeklyWaterAvg),
    currentWeight: lastWeight?.weightKg ?? null,
    targetWeight: profile?.targetWeight ?? null,
    activePlanTitle: activePlan?.titleAr ?? activePlan?.title ?? null,
    recentEntries,
  });
});

router.get("/dashboard/progress", async (req: AuthRequest, res) => {
  const { days = "30" } = req.query as Record<string, string>;
  const daysNum = parseInt(days);
  const since = new Date(Date.now() - daysNum * 86400000).toISOString().split("T")[0];
  const userId = req.userId!;

  const weightData = await db.select({ date: weightLogsTable.date, value: weightLogsTable.weightKg })
    .from(weightLogsTable)
    .where(and(eq(weightLogsTable.userId, userId), gte(weightLogsTable.date, since)))
    .orderBy(weightLogsTable.date);

  const energyRows = await db.select({
    date: trackerEntriesTable.date,
    avg: sql<number>`avg(${trackerEntriesTable.energyLevel})::numeric(5,2)`,
  })
    .from(trackerEntriesTable)
    .where(and(eq(trackerEntriesTable.userId, userId), gte(trackerEntriesTable.date, since), eq(trackerEntriesTable.type, "meal")))
    .groupBy(trackerEntriesTable.date)
    .orderBy(trackerEntriesTable.date);

  const energyData = energyRows.map(r => ({ date: r.date, value: Number(r.avg) }));

  const adherenceRows = await db.select({
    date: trackerEntriesTable.date,
    total: sql<number>`count(*)::int`,
    tayyib: sql<number>`count(*) filter (where ${trackerEntriesTable.foodStatus} = 'tayyib')::int`,
  })
    .from(trackerEntriesTable)
    .where(and(eq(trackerEntriesTable.userId, userId), gte(trackerEntriesTable.date, since), eq(trackerEntriesTable.type, "meal")))
    .groupBy(trackerEntriesTable.date)
    .orderBy(trackerEntriesTable.date);

  const adherenceData = adherenceRows.map(r => ({
    date: r.date,
    value: r.total > 0 ? Math.round((r.tayyib / r.total) * 100) : 0,
  }));

  const waterRows = await db.select({
    date: trackerEntriesTable.date,
    value: sql<number>`sum(${trackerEntriesTable.waterMl})::int`,
  })
    .from(trackerEntriesTable)
    .where(and(eq(trackerEntriesTable.userId, userId), gte(trackerEntriesTable.date, since), eq(trackerEntriesTable.type, "water")))
    .groupBy(trackerEntriesTable.date)
    .orderBy(trackerEntriesTable.date);

  return res.json({
    weightData: weightData.map(r => ({ date: r.date, value: r.value })),
    energyData,
    adherenceData,
    waterData: waterRows.map(r => ({ date: r.date, value: r.value ?? 0 })),
  });
});

router.get("/dashboard/calendar", async (req: AuthRequest, res) => {
  const { year, month } = req.query as Record<string, string>;
  const userId = req.userId!;
  const now = new Date();
  const y = parseInt(year ?? String(now.getFullYear()));
  const m = parseInt(month ?? String(now.getMonth() + 1));
  const startDate = `${y}-${String(m).padStart(2, "0")}-01`;
  const endDate = new Date(y, m, 0).toISOString().split("T")[0];

  const rows = await db.select({
    date: trackerEntriesTable.date,
    total: sql<number>`count(*)::int`,
    tayyib: sql<number>`count(*) filter (where ${trackerEntriesTable.foodStatus} = 'tayyib')::int`,
  })
    .from(trackerEntriesTable)
    .where(and(
      eq(trackerEntriesTable.userId, userId),
      eq(trackerEntriesTable.type, "meal"),
      gte(trackerEntriesTable.date, startDate),
      sql`${trackerEntriesTable.date} <= ${endDate}`
    ))
    .groupBy(trackerEntriesTable.date);

  return res.json(rows.map(r => ({
    date: r.date,
    mealCount: r.total,
    adherenceScore: r.total > 0 ? Math.round((r.tayyib / r.total) * 100) : 0,
  })));
});

export default router;
