/**
 * Validation Error
 * Single Responsibility: 400 Bad Request validation failures
 */

import { AppError } from "./BaseError";

export class ValidationError extends AppError {
  constructor(message: string = "Validation failed") {
    super(message, 400);
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}
