/**
 * React Query - Query Hooks
 * Data fetching hooks using React Query
 * Auto-generated hooks from Orval are in lib/api/api.ts
 * 
 * This file provides additional custom query hooks and utilities
 */

import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type { HealthCheckResponse } from "@/types";

/**
 * Health check query
 */
export function useHealthCheck(
  options?: Omit<UseQueryOptions<HealthCheckResponse>, "queryKey" | "queryFn">
) {
  return useQuery<HealthCheckResponse>({
    queryKey: ["health"],
    queryFn: async () => {
      const response = await fetch("/api/health");
      if (!response.ok) throw new Error("Health check failed");
      return response.json();
    },
    ...options,
  });
}
