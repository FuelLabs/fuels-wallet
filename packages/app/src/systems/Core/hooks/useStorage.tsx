/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSyncExternalStore } from 'react';

import { Storage } from '../utils';

export function useStorageItem<T = any>(key: string, defaultValue?: T) {
  const state = useSyncExternalStore<T | null>(
    Storage.subscribe,
    () => Storage.getItem<T>(key) ?? defaultValue ?? null,
  );
  const setState = (value: T) => {
    Storage.setItem(key, value);
  };
  return [state, setState] as const;
}
