import { useSyncExternalStore } from 'react';

import { Storage } from '../utils';

export function useStorageItem<T = unknown>(key: string, defaultValue?: T) {
  const state = useSyncExternalStore<T | null>(
    Storage.subscribe,
    () => Storage.getItem<T>(key) ?? defaultValue ?? null
  );
  const setState = (value: T) => {
    Storage.setItem(key, value);
  };
  return [state, setState] as const;
}
