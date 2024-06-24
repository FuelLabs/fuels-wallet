import { Environment, useCurrentEnv } from './useCurrentEnv';

export function useExtensionTitle() {
  const environment = useCurrentEnv();

  return environment === Environment.STAGING
    ? 'Fuel Wallet Development'
    : 'Fuel Wallet';
}
