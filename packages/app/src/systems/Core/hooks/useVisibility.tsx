import { useStorageItem } from './useStorage';

export function useBalanceVisibility() {
  const [visibility, setVisibility] = useStorageItem<boolean>(
    'balanceVisibility',
    true
  );
  return {
    visibility: visibility as boolean,
    setVisibility,
  };
}
