/**
 * Conflict Error
 * Single Responsibility: 409 Resource conflict errors (duplicate, etc)
 */

import { AppError } from "./BaseError";

export class ConflictError extends AppError {
  constructor(message: string = "Conflict") {
    super(message, 409);
    Object.setPrototypeOf(this, ConflictError.prototype);
  }
}
