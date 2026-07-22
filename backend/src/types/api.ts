/**
 * API Types
 * Request/Response types for API endpoints
 */

export interface HealthCheckResponse {
  status: "ok" | "error";
  timestamp: string;
  uptime: number;
}
