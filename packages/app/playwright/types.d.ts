import type { Fuel } from '@fuel-wallet/sdk';
import type { Address } from 'fuels';

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    fuel: Fuel;
    createAddress: (string: string) => Address;
  }
}

export {};
