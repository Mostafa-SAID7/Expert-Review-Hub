/**
 * Response Utilities
 * Single Responsibility: Format API responses
 * Dependency Inversion: Uses generic types, no hardcoded dependencies
 */

import type { ApiResponse, PaginatedResponse } from "../types";

/**
 * Format success response
 */
export function formatSuccess<T = unknown>(
  message: string,
  data?: T
): ApiResponse<T> {
  return {
    success: true,
    message,
    data,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Format error response
 */
export function formatError(
  message: string,
  error?: unknown
): Omit<ApiResponse, "data"> {
  return {
    success: false,
    message,
    error: error instanceof Error ? error.message : String(error),
    timestamp: new Date().toISOString(),
  };
}

/**
 * Format paginated response
 */
export function formatPaginated<T>(
  items: T[],
  total: number,
  page: number,
  limit: number
): PaginatedResponse<T> {
  return {
    items,
    total,
    page,
    limit,
    pages: Math.ceil(total / limit),
  };
}
