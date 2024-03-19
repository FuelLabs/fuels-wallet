import { isB256 } from 'fuels';

export function shortAddress(address = '') {
  return address.length > 10
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : address;
}

export function isValidEthAddress(address = '') {
  const isPadded =
    isB256(address) && address.slice(0, 26) === '0x000000000000000000000000';
  const isEthAddress = /^0x[a-fA-F0-9]{40}$/.test(address);
  return isPadded || isEthAddress;
}
