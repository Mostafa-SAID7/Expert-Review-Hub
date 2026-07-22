/**
 * Auth Types
 * Authentication related types
 */

export interface User {
  id: string;
  email: string;
  name: string;
  role: "user" | "admin" | "reviewer";
}

export interface AuthToken {
  access_token: string;
  expires_in: number;
  token_type: "Bearer";
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
