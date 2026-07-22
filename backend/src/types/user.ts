/**
 * User Domain Types
 * Single Responsibility: User-related type definitions only
 */

export interface UserRole {
  value: string;
}

export interface UserProfile {
  id: string;
  userId: string;
  language?: string;
  goal?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface UserProfileLanguage {
  value: string;
}

export interface UserProfileGoal {
  value: string;
}

export interface UserProfileUpdate {
  language?: string;
  goal?: string;
}

export interface UserProfileUpdateLanguage {
  value: string;
}

export interface UserProfileUpdateGoal {
  value: string;
}
