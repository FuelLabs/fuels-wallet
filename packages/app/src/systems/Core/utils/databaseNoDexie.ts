export const createParallelDb = async () => {
  // add table outside of dexie to test if it will be corrupted also with dexie FuelDB
  if (typeof window !== 'undefined') {
    const request = await window.indexedDB.open('TestDatabase', 2);
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBRequest)?.result;
      db.createObjectStore('myTable', { keyPath: 'id' });
    };
    request.onsuccess = (event: Event) => {
      const db = (event.target as IDBRequest).result as IDBDatabase;
      const tx = db.transaction('myTable', 'readwrite');
      const store = tx.objectStore('myTable');

      const countRequest = store.count();
      countRequest.onsuccess = () => {
        if (countRequest.result === 0) {
          store.add({ id: 1, name: 'John' });
        }
      };
    };
  }
};

export const clearParallelDb = async () => {
  if (typeof window !== 'undefined') {
    await window.indexedDB.deleteDatabase('TestDatabase');
  }
};
