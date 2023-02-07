class LocalStorageMock {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;

  clear() {
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
