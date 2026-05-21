import { Router } from "express";
import { db } from "@workspace/db";
import { userProfilesTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAuth, type AuthRequest } from "../middlewares/auth";
import { UpdateProfileBody } from "@workspace/api-zod";

const router = Router();
router.use(requireAuth);

router.get("/profile", async (req: AuthRequest, res) => {
  const userId = req.userId!;
  let [profile] = await db.select().from(userProfilesTable).where(eq(userProfilesTable.userId, userId)).limit(1);
  if (!profile) {
    const [created] = await db.insert(userProfilesTable).values({ userId, goal: "general", language: "ar" }).returning();
    profile = created;
  }
  return res.json(profile);
});

router.patch("/profile", async (req: AuthRequest, res) => {
  const userId = req.userId!;
  const parsed = UpdateProfileBody.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid input" });

  const [existing] = await db.select().from(userProfilesTable).where(eq(userProfilesTable.userId, userId)).limit(1);
  if (existing) {
    const [updated] = await db.update(userProfilesTable)
      .set({ ...parsed.data, updatedAt: new Date() })
      .where(eq(userProfilesTable.userId, userId))
      .returning();
    return res.json(updated);
  } else {
    const [created] = await db.insert(userProfilesTable).values({ userId, goal: "general", language: "ar", ...parsed.data }).returning();
    return res.json(created);
  }
});

export default router;
