/**
 * Unauthorized Error
 * Single Responsibility: 401 Authentication failures
 */

import { AppError } from "./BaseError.js";

export class UnauthorizedError extends AppError {
  constructor(message: string = "Unauthorized") {
    super(message, 401);
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }
}
