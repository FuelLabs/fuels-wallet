import { useIsPreviewEnv } from './useIsPreviewEnv';

export function useExtensionTitle() {
  const isPreview = useIsPreviewEnv();

  return isPreview ? 'Fuel Wallet Development' : 'Fuel Wallet';
}
