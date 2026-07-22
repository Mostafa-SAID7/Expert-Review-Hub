/**
 * User Roles Constants
 * Single Responsibility: User role definitions only
 */

export const USER_ROLES = {
  USER: "user",
  ADMIN: "admin",
  REVIEWER: "reviewer",
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];
