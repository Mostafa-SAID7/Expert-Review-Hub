/**
 * Common Frontend Types
 * Shared interfaces and types
 */

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export type LoadingState = "idle" | "loading" | "success" | "error";
