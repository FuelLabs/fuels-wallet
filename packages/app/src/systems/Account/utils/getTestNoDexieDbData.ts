export const getTestNoDexieDbData = () =>
  new Promise((resolve, reject) => {
    async function getData() {
      const request = await window.indexedDB.open('TestDatabase');
      request.onsuccess = (event: Event) => {
        const db = (event.target as IDBRequest).result as IDBDatabase;
        const tx = db.transaction('myTable', 'readonly');
        const store = tx.objectStore('myTable');

        // Get all the data from the object store
        const request = store.getAll();
        request.onsuccess = (event: Event) => {
          const data = (event.target as IDBRequest).result;
          resolve(data);
        };
      };
    }
    getData();

    setTimeout(() => {
      reject(new Error('Timeout'));
    }, 10000);
  });
