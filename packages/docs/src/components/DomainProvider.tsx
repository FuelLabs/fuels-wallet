import type { ReactNode } from 'react';
import { DomainContext } from '../constants';

export type Props = {
  children: ReactNode;
};

export function DomainProvider({ children }: Props) {
  const currentDomainUrl =
    typeof window !== 'undefined'
      ? `${window.location.protocol}//${window.location.hostname}`
      : '';

  return (
    <DomainContext.Provider value={currentDomainUrl}>
      {children}
    </DomainContext.Provider>
  );
}
