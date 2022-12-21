/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useSyncExternalStore } from 'react';

import { Storage } from '../utils';

export function useStorageItem<T = any>(key: string, defaultValue?: T) {
  const state = useSyncExternalStore<T | null>(
    Storage.subscribe,
    () => Storage.getItem<T>(key) ?? defaultValue ?? null
  );
  const setState = useCallback((value: T) => {
    Storage.setItem(key, value);
  }, []);
  return [state, setState] as const;
}
