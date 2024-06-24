import { IS_PUBLIC_PREVIEW } from '../constants';
import { Environment, useCurrentEnv } from './useCurrentEnv';

export function useIsPreviewEnv() {
  const environment = useCurrentEnv();

  switch (environment) {
    case Environment.STAGING:
    case Environment.NEXT:
    case Environment.PREVIEW:
      return true;
    default:
      return false;
  }
}
