// Frames that opened a dApp connection, kept in session storage because the
// worker, and every port with it, goes away when Chrome stops it. Iframed
// dApps live in tabs whose URL belongs to the host page, so a tab query by
// origin cannot find them.

// connectionId tells registrations of the same frame apart, so cleanup for
// a failed delivery can't remove a newer one
export type DappFrame = {
  tabId: number;
  frameId: number;
  origin: string;
  connectionId: string;
};

const KEY = 'dappFrames';
const MAX_FRAMES = 200;

let queue: Promise<unknown> = Promise.resolve();

function storage() {
  return globalThis.chrome?.storage?.session;
}

export function frameKey(tabId: number, frameId: number) {
  return `${tabId}:${frameId}`;
}

async function read(): Promise<DappFrame[]> {
  const items = await storage()?.get(KEY);
  return (items?.[KEY] as DappFrame[] | undefined) ?? [];
}

// Writes run one at a time so concurrent connections don't drop each other
function update(change: (frames: DappFrame[]) => DappFrame[]) {
  queue = queue
    .then(async () => {
      const session = storage();
      if (!session) return;
      await session.set({ [KEY]: change(await read()) });
    })
    .catch(() => {});
  return queue;
}

export function rememberFrame(frame: DappFrame) {
  return update((frames) => {
    const key = frameKey(frame.tabId, frame.frameId);
    const rest = frames.filter((f) => frameKey(f.tabId, f.frameId) !== key);
    return [...rest, frame].slice(-MAX_FRAMES);
  });
}

export function forgetFrame(connectionId: string) {
  return update((frames) =>
    frames.filter((f) => f.connectionId !== connectionId)
  );
}

export function forgetTab(tabId: number) {
  return update((frames) => frames.filter((f) => f.tabId !== tabId));
}

export async function framesFor(origins: string[]) {
  try {
    await queue;
    const frames = await read();
    return frames.filter((f) => origins.includes(f.origin));
  } catch {
    return [];
  }
}
