'use client';
import {
  IS_PUBLIC_PREVIEW,
  WALLET_LINK_NEXT,
  WALLET_LINK_STAGING,
} from '../constants';

export enum Environment {
  DEV = 'DEV',
  PROD = 'PROD',
  STAGING = 'STAGING',
  PREVIEW = 'PREVIEW',
  NEXT = 'NEXT',
}

export function useCurrentEnv() {
  const currentDomain =
    typeof window !== 'undefined'
      ? `${window.location.protocol}//${window.location.hostname}`
      : '';

  if (currentDomain?.includes('http://localhost')) return Environment.DEV;
  if (currentDomain?.includes(WALLET_LINK_NEXT)) return Environment.NEXT;
  if (currentDomain?.includes(WALLET_LINK_STAGING)) return Environment.STAGING;
  if (IS_PUBLIC_PREVIEW) return Environment.PREVIEW;

  return Environment.PROD;
}
