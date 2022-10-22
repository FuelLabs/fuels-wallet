import type { ReactNode } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import { IS_CRX_POPUP, IS_CRX_SIGN_UP } from './config';
import { OpenWelcome } from './systems/CRX/components';
import { Pages, PrivateRoute, PublicRoute } from './systems/Core';
import { DrawerRoutes } from './systems/Core/components/DrawerRoutes';
import { FaucetDialog } from './systems/Faucet';
import { networkRoutes } from './systems/Network';
import { signUpRoutes } from './systems/SignUp';
import { WalletCreatedPage } from './systems/SignUp/pages';

import { Wallet } from '~/systems/Wallet';

function PrivateRouterContent({ children }: { children: ReactNode }) {
  if (IS_CRX_POPUP)
    return <PrivateRoute reject={<OpenWelcome />}>{children}</PrivateRoute>;
  return (
    <PrivateRoute redirect={Pages.signUpWelcome()}>{children}</PrivateRoute>
  );
}

export const SignUpRoutes = () => {
  const { pathname } = useLocation();

  if (!pathname.includes(Pages.signUp())) return null;

  return (
    <Routes>
      <Route element={<PublicRoute redirect={Pages.signUpWalletCreated()} />}>
        {signUpRoutes}
      </Route>
      <Route
        path={Pages.signUpWalletCreated()}
        element={
          <PrivateRoute redirect={Pages.signUpWelcome()}>
            <WalletCreatedPage />
          </PrivateRoute>
        }
      />
    </Routes>
  );
};

export const WebAppRoutes = () => {
  if (IS_CRX_SIGN_UP) return null;
  return (
    <DrawerRoutes
      element={
        <PrivateRouterContent>
          <Wallet />
        </PrivateRouterContent>
      }
      avoidDrawer={[Pages.faucet()]}
    >
      <Route path={Pages.faucet()} element={<FaucetDialog />} />
      {networkRoutes}
    </DrawerRoutes>
  );
};

export const getRoutes = () => (
  <>
    <WebAppRoutes />
    <SignUpRoutes />
  </>
);
