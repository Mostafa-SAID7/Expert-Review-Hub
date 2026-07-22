import { pgTable, serial, text, pgEnum, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const foodStatusEnum = pgEnum("food_status", ["tayyib", "khabeeth"]);

export const foodsTable = pgTable("foods", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  nameAr: text("name_ar").notNull(),
  status: foodStatusEnum("status").notNull(),
  category: text("category").notNull(),
  imageUrl: text("image_url"),
  description: text("description"),
  descriptionAr: text("description_ar"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertFoodSchema = createInsertSchema(foodsTable).omit({ id: true, createdAt: true });
export type InsertFood = z.infer<typeof insertFoodSchema>;
export type Food = typeof foodsTable.$inferSelect;
