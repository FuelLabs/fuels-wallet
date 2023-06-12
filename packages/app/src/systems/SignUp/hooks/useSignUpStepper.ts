import { SignUpType } from '../machines/signUpMachine';

import { useSignUp } from './useSignUp';

export function useSignUpStepper() {
  const { context } = useSignUp();
  const isCreate = context.signUpType === SignUpType.create;
  const steps = isCreate ? 4 : 3;

  return {
    steps,
  };
}
