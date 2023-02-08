import type { EventEmitter } from 'events';

export class LocalStorage {
  private prefix!: string;
  private emitter!: EventEmitter;

  constructor(prefix: string, emitter?: EventEmitter) {
    this.prefix = prefix;
    if (emitter) {
      this.emitter = emitter;
    }
  }

  subscribe(listener: () => void): () => void;
  subscribe(listener: <T extends unknown[]>(...args: T) => void) {
    if (!this.emitter) return () => {};
    this.emitter.on('change', listener);
    return () => {
      this.emitter.off('change', listener);
    };
  }

  setItem<T>(key: string, value: T) {
    localStorage.setItem(this.createKey(key), JSON.stringify(value));
    this.dispatchChange(key, value);
  }

  getItem<T>(key: string): T | null {
    try {
      const data = localStorage.getItem(this.createKey(key));
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  clear() {
    Object.keys(localStorage)
      .filter((key) => key.startsWith(this.prefix))
      .forEach((key) => localStorage.removeItem(key));
    this.dispatchChange();
  }

  removeItem(key: string) {
    localStorage.removeItem(this.createKey(key));
    this.dispatchChange();
  }

  // ---------------------------------------------------------------------------
  // Private methods
  // ---------------------------------------------------------------------------
  private createKey(key: string) {
    return `${this.prefix}${key}`;
  }

  private dispatchChange<A extends unknown[]>(...args: A) {
    if (this.emitter) {
      this.emitter.emit('change', ...args);
    }
  }
}
