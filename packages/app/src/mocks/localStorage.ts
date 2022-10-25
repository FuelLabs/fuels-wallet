class LocalStorageMock {
  store = new Map();

  clear() {
    this.store.clear();
  }

  getItem(key: string) {
    return this.store.get(key);
  }

  setItem(key: string, value: string) {
    this.store.set(key, value.toString());
  }

  removeItem(key: string) {
    this.store.delete(key);
  }
}

export const localStorageMock = new LocalStorageMock();
