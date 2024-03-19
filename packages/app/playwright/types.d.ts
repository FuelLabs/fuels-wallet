import type { Address, Fuel } from 'fuels';

declare global {
  interface Window {
    fuel: Fuel;
    createAddress: (string: string) => Address;
  }
}
