import { pgTable, serial, integer, real, text, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./users";

export const userProfilesTable = pgTable("user_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => usersTable.id).unique(),
  goal: text("goal").default("general").notNull(),
  targetWeight: real("target_weight"),
  currentWeight: real("current_weight"),
  heightCm: real("height_cm"),
  dateOfBirth: text("date_of_birth"),
  gender: text("gender"),
  language: text("language").default("ar").notNull(),
  notificationsEnabled: boolean("notifications_enabled").default(true).notNull(),
  fastingReminderTime: text("fasting_reminder_time"),
  waterReminderIntervalHours: integer("water_reminder_interval_hours"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertUserProfileSchema = createInsertSchema(userProfilesTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertUserProfile = z.infer<typeof insertUserProfileSchema>;
export type UserProfile = typeof userProfilesTable.$inferSelect;
