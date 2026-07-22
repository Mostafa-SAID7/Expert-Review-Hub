/**
 * Message Constants
 * Single Responsibility: User-facing messages only
 */

export const MESSAGES = {
  // Success messages
  SUCCESS: "Operation successful",
  CREATED: "Resource created successfully",
  UPDATED: "Resource updated successfully",
  DELETED: "Resource deleted successfully",

  // Error messages
  ERROR: "An error occurred",
  NOT_FOUND: "Resource not found",
  UNAUTHORIZED: "Unauthorized access",
  FORBIDDEN: "Access forbidden",
  INVALID_CREDENTIALS: "Invalid email or password",
  VALIDATION_FAILED: "Validation failed",
  DUPLICATE_RESOURCE: "Resource already exists",
  INTERNAL_ERROR: "Internal server error",
} as const;
