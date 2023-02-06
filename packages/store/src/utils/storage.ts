/* eslint-disable @typescript-eslint/no-explicit-any */
const STORAGE_PREFIX = 'xstore_';

function createKey(key: string) {
  return `${STORAGE_PREFIX}${key}`;
}

export class Storage {
  static setItem(key: string, value: any) {
    localStorage.setItem(createKey(key), JSON.stringify(value));
  }

  static getItem<T>(key: string): T | null {
    try {
      const data = localStorage.getItem(createKey(key));
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  static clear() {
    Object.keys(localStorage)
      .filter((key) => key.startsWith(STORAGE_PREFIX))
      .forEach((key) => localStorage.removeItem(key));
  }

  static removeItem(key: string) {
    localStorage.removeItem(createKey(key));
  }
}
