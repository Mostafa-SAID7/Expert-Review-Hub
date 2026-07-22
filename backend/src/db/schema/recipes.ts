import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";

export const recipesTable = pgTable("recipes", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  titleAr: text("title_ar").notNull(),
  category: text("category").notNull(),
  goal: text("goal").notNull().default("general"),
  imageUrl: text("image_url"),
  ingredients: text("ingredients").notNull(),
  instructions: text("instructions").notNull(),
  prepTimeMinutes: integer("prep_time_minutes"),
  servings: integer("servings"),
  tags: text("tags").array(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Recipe = typeof recipesTable.$inferSelect;
export type InsertRecipe = typeof recipesTable.$inferInsert;
