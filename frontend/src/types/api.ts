/**
 * API Types
 * API request/response types
 */

export interface HealthCheckResponse {
  status: "ok" | "error";
  timestamp: string;
  uptime: number;
}
