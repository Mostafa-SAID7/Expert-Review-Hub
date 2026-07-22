/**
 * Auth Types
 * Authentication related type definitions
 */

export interface AuthToken {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  token_type: "Bearer";
}

export interface AuthPayload {
  id: string;
  email: string;
  role: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}
