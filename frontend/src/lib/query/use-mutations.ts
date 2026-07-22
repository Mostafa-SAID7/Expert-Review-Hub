/**
 * React Query - Mutation Hooks
 * Data mutation hooks using React Query
 * Auto-generated hooks from Orval are in lib/api/api.ts
 * 
 * This file provides additional custom mutation hooks and utilities
 */

import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import type { AuthToken } from "@/types";

/**
 * Generic mutation hook factory
 */
export function createMutationHook<TData, TError, TVariables>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options?: UseMutationOptions<TData, TError, TVariables>
) {
  return (opt?: UseMutationOptions<TData, TError, TVariables>) =>
    useMutation<TData, TError, TVariables>({
      mutationFn,
      ...options,
      ...opt,
    });
}
