import { Mnemonic } from '@fuel-ts/mnemonic';

import { VITE_MNEMONIC_WORDS } from '~/config';

export function isValidMnemonic(phrase: string): boolean {
  const words = phrase.split(' ');
  const mnemonic = new Mnemonic();
  return (
    words.filter((w) => mnemonic.wordlist.includes(w)).length ===
    Number(VITE_MNEMONIC_WORDS)
  );
}
