/**
 * API Client Configuration
 * SOLID-compliant API client
 * 
 * S - Single Responsibility: HTTP requests only
 * O - Open/Closed: Extensible through configuration
 * L - Liskov Substitution: Implements IHttpClient interface
 * I - Interface Segregation: Specific methods for each HTTP verb
 * D - Dependency Inversion: Inject config, don't hardcode
 */

import { API_BASE_URL } from "@/constants";

/**
 * HTTP Client Interface
 * Defines contract for HTTP operations
 */
export interface IHttpClient {
  get<T>(endpoint: string, init?: RequestInit): Promise<T>;
  post<T>(endpoint: string, body?: unknown, init?: RequestInit): Promise<T>;
  put<T>(endpoint: string, body?: unknown, init?: RequestInit): Promise<T>;
  delete<T>(endpoint: string, init?: RequestInit): Promise<T>;
}

/**
 * API Client Configuration Interface
 */
export interface IApiClientConfig {
  baseURL: string;
  timeout?: number;
  headers?: Record<string, string>;
  onError?: (error: Error) => void;
}

/**
 * Error Response Interface
 */
export interface IApiError extends Error {
  statusCode: number;
  data?: unknown;
}

/**
 * HTTP Client Implementation
 */
export class HttpClient implements IHttpClient {
  private baseURL: string;
  private timeout: number;
  private defaultHeaders: Record<string, string>;
  private onError?: (error: Error) => void;

  constructor(config: IApiClientConfig) {
    this.baseURL = config.baseURL;
    this.timeout = config.timeout || 30000;
    this.defaultHeaders = {
      "Content-Type": "application/json",
      ...config.headers,
    };
    this.onError = config.onError;
  }

  async get<T>(endpoint: string, init?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...init, method: "GET" });
  }

  async post<T>(
    endpoint: string,
    body?: unknown,
    init?: RequestInit
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...init,
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async put<T>(
    endpoint: string,
    body?: unknown,
    init?: RequestInit
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...init,
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async delete<T>(endpoint: string, init?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...init, method: "DELETE" });
  }

  private async request<T>(endpoint: string, init: RequestInit): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...init,
        headers: {
          ...this.defaultHeaders,
          ...init.headers,
        },
        signal: controller.signal,
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw this.createError(
          error.message || `HTTP ${response.status}`,
          response.status,
          error
        );
      }

      return response.json() as Promise<T>;
    } catch (error) {
      if (error instanceof Error) {
        this.onError?.(error);
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  private createError(
    message: string,
    statusCode: number,
    data?: unknown
  ): IApiError {
    const error: IApiError = new Error(message) as IApiError;
    error.statusCode = statusCode;
    error.data = data;
    return error;
  }
}

/**
 * Global API client instance
 */
export const apiClient = new HttpClient({
  baseURL: API_BASE_URL,
});
