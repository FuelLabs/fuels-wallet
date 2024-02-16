import type { Fuel, Address } from 'fuels';

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    fuel: Fuel;
    createAddress: (string: string) => Address;
  }
}

export {};
