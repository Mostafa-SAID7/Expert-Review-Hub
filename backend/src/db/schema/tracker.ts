import { pgTable, serial, integer, text, timestamp, date, pgEnum, real } from "drizzle-orm/pg-core";
import { usersTable } from "./users.js";

export const entryTypeEnum = pgEnum("entry_type", ["meal", "water", "fasting", "symptom"]);

export const trackerEntriesTable = pgTable("tracker_entries", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => usersTable.id),
  type: entryTypeEnum("type").notNull(),
  date: date("date").notNull(),
  time: text("time"),
  foodName: text("food_name"),
  foodStatus: text("food_status"),
  quantity: text("quantity"),
  notes: text("notes"),
  imageUrl: text("image_url"),
  waterMl: integer("water_ml"),
  fastingHours: real("fasting_hours"),
  hungerLevel: integer("hunger_level"),
  energyLevel: integer("energy_level"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type TrackerEntry = typeof trackerEntriesTable.$inferSelect;
export type InsertTrackerEntry = typeof trackerEntriesTable.$inferInsert;

export const weightLogsTable = pgTable("weight_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => usersTable.id),
  weightKg: real("weight_kg").notNull(),
  date: date("date").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type WeightLog = typeof weightLogsTable.$inferSelect;
export type InsertWeightLog = typeof weightLogsTable.$inferInsert;
