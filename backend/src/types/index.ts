/**
 * Types Index
 * Re-exports core type definitions only
 * 
 * Domain types (User, Food, TrackerEntry, etc.) are imported from db/schema
 * to maintain single source of truth - avoid duplication
 */

// Core types - NOT from DB (only for API/Auth/Common)
export type * from "./api.js";
export type * from "./auth.js";
export type * from "./common.js";

// For domain types, import directly from db/schema:
// import type { User, Food, TrackerEntry, WeightLog } from "../db/schema"
