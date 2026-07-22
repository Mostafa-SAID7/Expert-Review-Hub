/**
 * Meal Plan Domain Types
 * Single Responsibility: Meal plan type definitions only
 */

export interface MealPlan {
  id: string;
  userId: string;
  name: string;
  created_at?: Date;
  entries?: MealPlanEntry[];
}

export interface MealPlanEntry {
  id: string;
  planId: string;
  mealTime: string;
  foods?: Food[];
}

export interface MealPlanEntryMealTime {
  value: string;
}

export interface MealPlanGoal {
  value: string;
}

export interface MealPlanInput {
  name: string;
  goal: MealPlanInputGoal;
  entries?: MealPlanEntry[];
}

export interface MealPlanInputGoal {
  value: string;
}

export interface MealPlanUpdate {
  name?: string;
  goal?: MealPlanUpdateGoal;
}

export interface MealPlanUpdateGoal {
  value: string;
}

// Re-export Food for meal plan entries
export type { Food } from "./food";
