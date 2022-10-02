/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-unused-vars */

declare namespace Cypress {
  interface Chainable<Subject> {
    clearIndexedDb(databaseName: string): void;
    openIndexedDb(
      databaseName: string,
      version?: number
    ): Chainable<IDBDatabase>;
    getIndexedDb(databaseName: string): Chainable<IDBDatabase>;
    createObjectStore(
      storeName: string,
      options?: IDBObjectStoreParameters
    ): Chainable<IDBObjectStore>;
    getStore(storeName: string): Chainable<IDBObjectStore>;
    createItem(key: IDBValidKey, value: unknown): Chainable<IDBObjectStore>;
    readItem<T = unknown>(key: IDBValidKey | IDBKeyRange): Chainable<T>;
    updateItem(key: IDBValidKey, value: unknown): Chainable<IDBObjectStore>;
    deleteItem(key: IDBValidKey): Chainable<IDBObjectStore>;
    addItem<T = unknown>(value: T): Chainable<IDBObjectStore>;
    keys(): Chainable<IDBValidKey[]>;
    entries<T = unknown>(): Chainable<T[]>;
  }
}
