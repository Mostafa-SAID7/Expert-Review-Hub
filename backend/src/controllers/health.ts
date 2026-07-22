/**
 * Health Controller
 * Handles health check endpoints
 */

import type { Request, Response } from "express";
import { formatSuccess } from "../utils/index.js";
import type { HealthCheckResponse } from "../types/index.js";

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
    res.json(formatSuccess("Health check passed", data));
  }
}
