import { isB256 } from 'fuels';

export function shortAddress(
  address = '',
  options: { left: number; right: number } = {
    left: 6,
    right: 4,
  }
) {
  return address.length > 10
    ? `${address.slice(0, options.left)}...${address.slice(-options.right)}`
    : address;
}

export function isValidEthAddress(address = '') {
  const isPadded =
    isB256(address) && address.slice(0, 26) === '0x000000000000000000000000';
  const isEthAddress = /^0x[a-fA-F0-9]{40}$/.test(address);
  return isPadded || isEthAddress;
}
