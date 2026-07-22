/**
 * Repository Pattern
 * SOLID-compliant data access abstraction
 * 
 * Defines contracts for database operations
 * Separates data access from business logic
 */

/**
 * Generic repository interface
 * Provides common CRUD operations for any entity
 */
export interface IRepository<T, ID = string> {
  /**
   * Find by ID
   */
  findById(id: ID): Promise<T | null>;

  /**
   * Find all
   */
  findAll(options?: { limit?: number; offset?: number }): Promise<T[]>;

  /**
   * Create new entity
   */
  create(data: Partial<T>): Promise<T>;

  /**
   * Update existing entity
   */
  update(id: ID, data: Partial<T>): Promise<T | null>;

  /**
   * Delete entity
   */
  delete(id: ID): Promise<boolean>;

  /**
   * Count entities
   */
  count(): Promise<number>;
}

/**
 * Generic repository base implementation
 */
export abstract class BaseRepository<T, ID = string>
  implements IRepository<T, ID>
{
  abstract findById(id: ID): Promise<T | null>;
  abstract findAll(options?: { limit?: number; offset?: number }): Promise<T[]>;
  abstract create(data: Partial<T>): Promise<T>;
  abstract update(id: ID, data: Partial<T>): Promise<T | null>;
  abstract delete(id: ID): Promise<boolean>;
  abstract count(): Promise<number>;
}
