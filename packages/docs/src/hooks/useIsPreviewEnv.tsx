import { IS_PUBLIC_PREVIEW } from '../constants';

export function useIsPreviewEnv() {
  return !!IS_PUBLIC_PREVIEW;
}
