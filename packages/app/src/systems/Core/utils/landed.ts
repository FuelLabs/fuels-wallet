import { useEffect, useState } from 'react';

/*
 * The shared success language: whatever an action just created or changed
 * takes the hit where it shows up, instead of a toast about it. Marks expire
 * so a later visit never replays an old moment.
 */
const LANDED_TTL_MS = 6000;
const LANDED_HOLD_MS = 1600;
const landed = new Map<string, number>();
const listeners = new Set<() => void>();

export function markLanded(id: string) {
  landed.set(id, Date.now());
  for (const listener of listeners) listener();
}

function take(id: string) {
  const at = landed.get(id);
  if (at === undefined) return false;
  landed.delete(id);
  return Date.now() - at < LANDED_TTL_MS;
}

/** True for a moment once `id` lands, whether it mounts afterwards or is already on screen. */
export function useLanded(id?: string) {
  const [isLanded, setIsLanded] = useState(false);

  useEffect(() => {
    if (!id) return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const check = () => {
      if (!take(id)) return;
      setIsLanded(true);
      clearTimeout(timer);
      timer = setTimeout(() => setIsLanded(false), LANDED_HOLD_MS);
    };
    check();
    listeners.add(check);
    return () => {
      listeners.delete(check);
      clearTimeout(timer);
      setIsLanded(false);
    };
  }, [id]);

  return isLanded;
}
