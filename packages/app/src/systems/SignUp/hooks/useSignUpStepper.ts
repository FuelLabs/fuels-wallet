import { SignUpType } from '../machines/signUpMachine';

import { useSignUp } from './useSignUp';

const CREATE_STEPS = ['Terms', 'Back up', 'Confirm', 'Password'];
const IMPORT_STEPS = ['Terms', 'Import', 'Password'];

/* The art starts faint on the welcome screen and is fully developed when the wallet is ready. */
const WELCOME_PROGRESS = 0.3;

export function useSignUpStepper() {
  const { context } = useSignUp();
  const isImport = context.signUpType === SignUpType.import;
  const labels = isImport ? IMPORT_STEPS : CREATE_STEPS;
  const steps = labels.length;

  /** Art progress while on `step`; past the last step means done. */
  function progressAt(step: number) {
    if (step > steps) return 1;
    return WELCOME_PROGRESS + ((1 - WELCOME_PROGRESS) * (step - 1)) / steps;
  }

  return {
    isImport,
    steps,
    labels,
    progressAt,
    welcomeProgress: WELCOME_PROGRESS,
  };
}
