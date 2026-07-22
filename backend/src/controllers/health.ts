/**
 * Health Controller
 * Handles health check endpoints
 */

import type { Request, Response } from "express";
import { successResponse } from "../utils";
import type { HealthCheckResponse } from "../types";

export class HealthController {
  /**
   * Get health status
   */
  static check(req: Request, res: Response): void {
    const uptime = process.uptime();
    const data: HealthCheckResponse = {
      status: "ok",
      timestamp: new Date().toISOString(),
      uptime,
    };
    res.json(successResponse("Health check passed", data));
  }
}
