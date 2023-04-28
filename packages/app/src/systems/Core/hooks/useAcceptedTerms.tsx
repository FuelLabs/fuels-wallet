import { useStorageItem } from './useStorage';

import { HAS_ACCEPTED_TERMS_KEY } from '~/config';

export function useHasAcceptedTerms() {
  const [hasAcceptedTerms, setHasAcceptedTerms] = useStorageItem<boolean>(
    HAS_ACCEPTED_TERMS_KEY,
    false
  );
  return {
    hasAcceptedTerms: Boolean(hasAcceptedTerms),
    setHasAcceptedTerms,
  };
}
