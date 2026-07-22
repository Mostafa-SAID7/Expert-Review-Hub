/**
 * Types Index
 * Re-exports all type definitions organized by domain
 */

// Core types
export type * from "./api";
export type * from "./auth";
export type * from "./common";

// Domain types - each domain in its own file
export type * from "./user";
export type * from "./food";
export type * from "./recipe";
export type * from "./tracker";
export type * from "./mealplan";
export type * from "./dashboard";
