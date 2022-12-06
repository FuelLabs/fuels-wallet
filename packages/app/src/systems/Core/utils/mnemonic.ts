import { Mnemonic } from '@fuel-ts/mnemonic';

export function isValidMnemonic(phrase: string): boolean {
  try {
    return !!Mnemonic.mnemonicToEntropy(phrase);
  } catch (e) {
    return false;
  }
}
