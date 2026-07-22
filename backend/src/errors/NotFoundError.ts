/**
 * Not Found Error
 * Single Responsibility: 404 Resource not found errors
 */

import { AppError } from "./BaseError";

export class NotFoundError extends AppError {
  constructor(resource: string = "Resource") {
    super(`${resource} not found`, 404);
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}
