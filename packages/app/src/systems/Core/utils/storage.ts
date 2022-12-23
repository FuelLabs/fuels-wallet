/* eslint-disable @typescript-eslint/no-explicit-any */
import { EventEmitter } from 'events';

const STORAGE_PREFIX = 'fuel_';

function createKey(key: string) {
  return `${STORAGE_PREFIX}${key}`;
}

export class Storage {
  static events = new EventEmitter();

  static subscribe(listener: () => void) {
    Storage.events.on('change', listener);
    return () => {
      Storage.events.off('change', listener);
    };
  }

  static emitChange() {
    Storage.events.emit('change');
  }

  static setItem(key: string, value: any) {
    localStorage.setItem(createKey(key), JSON.stringify(value));
    Storage.events.emit('change');
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
    Storage.events.emit('change');
  }

  static removeItem(key: string) {
    localStorage.removeItem(createKey(key));
    Storage.events.emit('change');
  }
}
