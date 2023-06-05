import { isB256 } from 'fuels';

export function shortAddress(address: string = '') {
  return address.length > 10
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : address;
}

export function isValidEthAddress(address: string = '') {
  return isB256(address) || /^0x[a-fA-F0-9]{40}$/.test(address);
}
