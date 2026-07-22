/**
 * Validation Schemas
 * Zod schemas for request/response validation
 * Auto-generated from OpenAPI spec via Orval
 */

import * as z from "zod";

// Auth Schemas
export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const RegisterSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
});

// Pagination Schemas
export const PaginationSchema = z.object({
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(20),
});

// Food Schemas
export const FoodStatusSchema = z.enum(["tayyib", "khabeeth"]);

export const CreateFoodSchema = z.object({
  name: z.string(),
  category: z.string(),
  status: FoodStatusSchema,
  description: z.string().optional(),
});

// Tracker Schemas
export const TrackerTypeSchema = z.enum(["meal", "water", "fasting", "symptom"]);

export const CreateTrackerEntrySchema = z.object({
  type: TrackerTypeSchema,
  date: z.coerce.date(),
  foodName: z.string().optional(),
  foodStatus: FoodStatusSchema.optional(),
  quantity: z.string().optional(),
  waterMl: z.number().optional(),
  hungerLevel: z.number().min(1).max(10).optional(),
  energyLevel: z.number().min(1).max(10).optional(),
});

// Meal Plan Schemas
export const MealPlanGoalSchema = z.enum([
  "weight_loss",
  "diabetes",
  "energy",
  "general",
]);

export const CreateMealPlanSchema = z.object({
  title: z.string(),
  goal: MealPlanGoalSchema,
  startDate: z.coerce.date(),
  notes: z.string().optional(),
});

// Profile Schemas
export const LanguageSchema = z.enum(["ar", "en"]);

export const UpdateProfileSchema = z.object({
  goal: MealPlanGoalSchema.optional(),
  targetWeight: z.number().optional(),
  currentWeight: z.number().optional(),
  heightCm: z.number().optional(),
  language: LanguageSchema.optional(),
});

// Weight Log Schemas
export const CreateWeightLogSchema = z.object({
  weightKg: z.number().positive(),
  date: z.coerce.date(),
  notes: z.string().optional(),
});
