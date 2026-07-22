/**
 * Food Domain Types
 * Single Responsibility: Food and food category type definitions only
 */

export interface Food {
  id: string;
  name: string;
  category: string;
  status: string;
  calories?: number;
  created_at?: Date;
}

export interface FoodCategory {
  value: string;
}

export interface FoodStatus {
  value: string;
}

export interface FoodListResponse {
  items: Food[];
  total: number;
  page: number;
  limit: number;
}

export interface ListFoodsParams {
  page?: number;
  limit?: number;
  category?: string;
  status?: string;
}

export interface ListFoodsStatus {
  value: string;
}
