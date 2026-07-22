/**
 * Forbidden Error
 * Single Responsibility: 403 Authorization failures
 */

import { AppError } from "./BaseError.js";

export class ForbiddenError extends AppError {
  constructor(message: string = "Forbidden") {
    super(message, 403);
    Object.setPrototypeOf(this, ForbiddenError.prototype);
  }
}
