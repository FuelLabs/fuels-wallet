import { SignUpService } from '~/systems/SignUp';

export function useIsSigningUp() {
  return SignUpService.hasSaved();
}
