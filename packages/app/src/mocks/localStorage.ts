class LocalStorageMock {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  [key: string]: any;

  clear() {
    // biome-ignore lint/complexity/noForEach: <explanation>
    Object.keys(this).forEach((key) => {
      delete this[key];
    });
  }

  getItem(key: string) {
    return this[key] || null;
  }

  setItem(key: string, value: string) {
    this[key] = value.toString();
  }

  removeItem(key: string) {
    delete this[key];
  }
}

export const localStorageMock = new LocalStorageMock();
