import { SignUpService } from '~/systems/SignUp';

export function useIsSigningUp() {
  const { mnemonic, account } = SignUpService.getSaved();
  return !!(mnemonic && account);
}
