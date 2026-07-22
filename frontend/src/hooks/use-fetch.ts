/**
 * useFetch Hook
 * Custom hook for data fetching with loading and error states
 */

import { useState, useEffect, useCallback } from "react";
import { ApiService, ApiError } from "@/services/api";

interface UseFetchState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

export function useFetch<T>(
  url: string,
  options?: RequestInit
): UseFetchState<T> & { refetch: () => Promise<void> } {
  const [state, setState] = useState<UseFetchState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  const apiService = new ApiService();

  const fetch = useCallback(async () => {
    setState({ data: null, loading: true, error: null });
    try {
      const data = await apiService.get<T>(url, options);
      setState({ data, loading: false, error: null });
    } catch (error) {
      setState({
        data: null,
        loading: false,
        error: error instanceof Error ? error : new Error(String(error)),
      });
    }
  }, [url, options]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { ...state, refetch: fetch };
}
