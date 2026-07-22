/**
 * Base Service & Interfaces
 * SOLID-compliant base classes and interfaces for services
 * 
 * S - Single Responsibility: Each service handles one domain
 * O - Open/Closed: Services extend base, not modify existing
 * L - Liskov Substitution: All services implement IService interface
 * I - Interface Segregation: Specific interfaces for each domain
 * D - Dependency Inversion: Inject dependencies, don't create them
 */

import { logger } from "../lib/logger.js";

/**
 * Generic service interface
 * Defines contract for all services
 */
export interface IService {
  getName(): string;
}

/**
 * Logger interface for dependency injection
 */
export interface ILogger {
  info(message: string, data?: unknown): void;
  error(message: string, error: unknown): void;
  warn(message: string, data?: unknown): void;
  debug(message: string, data?: unknown): void;
}

/**
 * Base service class
 * Provides common functionality for all domain services
 */
export abstract class BaseService implements IService {
  protected readonly name: string;
  protected readonly logger: ILogger;

  constructor(name: string, logger?: ILogger) {
    this.name = name;
    this.logger = logger || {
      info: (msg, data) => console.log(msg, data),
      error: (msg, err) => console.error(msg, err),
      warn: (msg, data) => console.warn(msg, data),
      debug: (msg, data) => console.debug(msg, data),
    };
  }

  getName(): string {
    return this.name;
  }

  protected log(message: string, data?: unknown): void {
    this.logger.info(`[${this.name}] ${message}`, data);
  }

  protected logError(message: string, error: unknown): void {
    this.logger.error(`[${this.name}] ${message}`, error);
  }

  protected logWarn(message: string, data?: unknown): void {
    this.logger.warn(`[${this.name}] ${message}`, data);
  }

  protected logDebug(message: string, data?: unknown): void {
    this.logger.debug(`[${this.name}] ${message}`, data);
  }
}
