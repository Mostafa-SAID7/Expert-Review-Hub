/**
 * Storage Utilities
 * LocalStorage helper functions with type safety
 */

const PREFIX = "app_";

export const storage = {
  /**
   * Get item from localStorage
   */
  getItem<T>(key: string, defaultValue?: T): T | null {
    try {
      const item = localStorage.getItem(PREFIX + key);
      return item ? (JSON.parse(item) as T) : defaultValue || null;
    } catch {
      return defaultValue || null;
    }
  },

  /**
   * Set item in localStorage
   */
  setItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(value));
    } catch {
      console.error(`Failed to set item: ${key}`);
    }
  },

  /**
   * Remove item from localStorage
   */
  removeItem(key: string): void {
    try {
      localStorage.removeItem(PREFIX + key);
    } catch {
      console.error(`Failed to remove item: ${key}`);
    }
  },

  /**
   * Clear all items from localStorage
   */
  clear(): void {
    try {
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith(PREFIX)) {
          localStorage.removeItem(key);
        }
      });
    } catch {
      console.error("Failed to clear storage");
    }
  },
};
