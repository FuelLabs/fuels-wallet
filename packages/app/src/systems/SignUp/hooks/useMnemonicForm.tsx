import { Mnemonic } from 'fuels';
import { useState } from 'react';
import { getPhraseFromValue } from '~/systems/Core';

import { ERRORS } from '../machines/signUpMachine';

export function useMnemonicForm(checkWords?: string[]) {
  const [isValid, setIsValid] = useState(false);
  const [error, setError] = useState('');
  const [words, setWords] = useState<Array<string>>([]);

  function onChange() {
    setError('');
    setIsValid(false);
  }

  function onFilled(words: string[]) {
    const isValid = Mnemonic.isMnemonicValid(getPhraseFromValue(words) || '');
    setError('');
    setIsValid(isValid);
    setWords(words);

    if (!isValid) {
      setError(ERRORS.seedPhraseInvalidError);
    }
    if (
      checkWords &&
      getPhraseFromValue(words) !== getPhraseFromValue(checkWords)
    ) {
      setError(ERRORS.seedPhraseMatchError);
    }
  }

  return {
    words,
    error,
    hasError: !!(error || !isValid),
    isValid,
    onFilled,
    onChange,
  };
}
