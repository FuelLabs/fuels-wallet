async function initOPFS() {
  const root = await navigator?.storage?.getDirectory();
  return root;
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export async function saveToOPFS(data: any) {
  if (
    !data.accounts?.length ||
    !data.vaults?.length ||
    !data.networks?.length
  ) {
    return;
  }

  const root = await initOPFS();
  if (!root) return;
  console.log('saving data to opfs', data);
  const fileHandle = await root.getFileHandle('backup.json', { create: true });
  const writable = await fileHandle.createWritable();
  await writable.write(JSON.stringify(data));
  await writable.close();
}

export async function readFromOPFS() {
  const root = await initOPFS();
  if (!root) return;
  try {
    const fileHandle = await root.getFileHandle('backup.json');
    const file = await fileHandle.getFile();
    const text = await file.text();
    return JSON.parse(text);
  } catch (_) {
    // Create empty backup file if it doesn't exist
    return {};
  }
}

// create a function to clean opfs
export async function cleanOPFS() {
  const root = await initOPFS();
  if (!root) return;
  await root.removeEntry('backup.json');
}
