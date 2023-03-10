import { Pages, PublicRoute } from '~/systems/Core';
import { useIsSigningUp } from '~/systems/Core/hooks/useIsSigningUp';

export const CRXPublicRoute = () => {
  const isSigningUp = useIsSigningUp();
  const redirectTo = isSigningUp
    ? Pages.signUpWalletCreated()
    : Pages.signUpCreateWallet();
  return <PublicRoute redirect={redirectTo} />;
};
