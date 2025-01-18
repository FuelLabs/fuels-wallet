import { bech32, bech32m } from 'bech32';
import { Address, arrayify, hexlify, isB256 } from 'fuels';

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

export function convertBech32ToEth(bech32Address: string): string {
  // Decode the Bech32 address
  const { words } = bech32.decode(bech32Address);

  // Convert from 5-bit words to 8-bit bytes
  const bytes = bech32.fromWords(words);

  // Convert the byte array to a hexadecimal string
  const ethAddress = `0x${Buffer.from(bytes).toString('hex')}`;

  return ethAddress;
}
export function isBech32(address: string): boolean {
  try {
    bech32.decode(address);
    return true;
  } catch {
    return false;
  }
}

export function toBech32(address: string) {
  return bech32m.encode('fuel', bech32m.toWords(arrayify(hexlify(address))));
}

export function safeConvertToB256(address: string) {
  try {
    return Address.fromDynamicInput(
      isBech32(address) ? convertBech32ToEth(address) : address
    ).toB256();
  } catch (error) {
    console.log(error);
    return address;
  }
}

export function safeDynamicAddress(address: string) {
  return Address.fromDynamicInput(safeConvertToB256(address));
}
