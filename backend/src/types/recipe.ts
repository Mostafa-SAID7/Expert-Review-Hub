/**
 * Recipe Domain Types
 * Single Responsibility: Recipe type definitions only
 */

export interface Recipe {
  id: string;
  name: string;
  description?: string;
  ingredients?: string[];
  instructions?: string[];
  created_at?: Date;
}

export interface ListRecipesParams {
  page?: number;
  limit?: number;
  search?: string;
}
