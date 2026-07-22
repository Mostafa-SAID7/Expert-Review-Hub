import { pgTable, serial, integer, text, timestamp, date, boolean, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./users";

export const goalEnum = pgEnum("goal", ["weight_loss", "diabetes", "energy", "general"]);
export const mealTimeEnum = pgEnum("meal_time", ["breakfast", "lunch", "dinner", "snack"]);

export const mealPlansTable = pgTable("meal_plans", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => usersTable.id),
  title: text("title").notNull(),
  titleAr: text("title_ar"),
  goal: goalEnum("goal").notNull().default("general"),
  startDate: date("start_date").notNull(),
  endDate: date("end_date"),
  isActive: boolean("is_active").default(false).notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const mealPlanEntriesTable = pgTable("meal_plan_entries", {
  id: serial("id").primaryKey(),
  planId: integer("plan_id").notNull().references(() => mealPlansTable.id),
  dayOfWeek: integer("day_of_week").notNull(),
  mealTime: mealTimeEnum("meal_time").notNull(),
  foodName: text("food_name").notNull(),
  quantity: text("quantity"),
  notes: text("notes"),
});

export const insertMealPlanSchema = createInsertSchema(mealPlansTable).omit({ id: true, createdAt: true });
export type InsertMealPlan = z.infer<typeof insertMealPlanSchema>;
export type MealPlan = typeof mealPlansTable.$inferSelect;
export type MealPlanEntry = typeof mealPlanEntriesTable.$inferSelect;
