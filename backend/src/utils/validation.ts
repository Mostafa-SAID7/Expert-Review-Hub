/**
 * Validation Utilities
 * Single Responsibility: Input validation
 * Interface Segregation: Specific validators for specific data types
 */

/**
 * Email validation
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Password validation
 * At least 8 characters, 1 uppercase, 1 lowercase, 1 number
 */
export function validatePassword(password: string): boolean {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return passwordRegex.test(password);
}

/**
 * UUID validation
 */
export function validateUUID(id: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
}

/**
 * Positive number validation
 */
export function validatePositiveNumber(value: unknown): value is number {
  return typeof value === "number" && value > 0;
}

/**
 * Date validation
 */
export function validateDate(date: unknown): date is Date {
  return date instanceof Date && !isNaN(date.getTime());
}

/**
 * Non-empty string validation
 */
export function validateNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}
