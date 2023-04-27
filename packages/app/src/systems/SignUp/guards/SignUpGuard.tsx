import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import { Pages } from '~/systems/Core';
import { useIsSigningUp } from '~/systems/Core/hooks/useIsSigningUp';

export function SignUpGuard() {
  const navigate = useNavigate();
  const isSigningUp = useIsSigningUp();

  useEffect(() => {
    if (isSigningUp) {
      navigate(Pages.signUpCreateWallet());
    }
  }, [isSigningUp]);

  return <Outlet />;
}
