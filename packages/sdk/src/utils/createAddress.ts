import { Address } from 'fuels';

export function createAddress(address: string) {
  return Address.fromString(address);
}
