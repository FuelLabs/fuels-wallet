import { useContext } from 'react';
import {
  DomainContext,
  WALLET_LINK_NEXT,
  WALLET_LINK_STAGING,
} from '~/src/constants';

export enum Environment {
  DEV = 'DEV',
  PROD = 'PROD',
  STAGING = 'STAGING',
  NEXT = 'NEXT',
}

export function useCurrentEnv() {
  const currentDomain = useContext(DomainContext);

  if (currentDomain?.includes('localhost')) return Environment.DEV;
  if (currentDomain?.includes(WALLET_LINK_NEXT)) return Environment.NEXT;
  if (currentDomain?.includes(WALLET_LINK_STAGING)) return Environment.STAGING;

  return Environment.PROD;
}
