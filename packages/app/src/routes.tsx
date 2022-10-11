import { Navigate, Route, Routes } from 'react-router-dom';

import { IS_CRX, IS_CRX_POPUP } from './config';
import { CRXPrivateRoute, CRXPublicRoute } from './systems/CRX/components';

import { accountRoutes } from '~/systems/Account';
import { PrivateRoute, PublicRoute } from '~/systems/Core';
import { Pages } from '~/systems/Core/types';
import { homeRoutes } from '~/systems/Home';
import { landingPageRoutes } from '~/systems/LandingPage';
import { networkRoutes } from '~/systems/Network';
import { signUpRoutes } from '~/systems/SignUp';
import { WalletCreatedPage } from '~/systems/SignUp/pages';

const walletRoutes = (
  <>
    {homeRoutes}
    {networkRoutes}
    {accountRoutes}
  </>
);

export const webAppRoutes = (
  <Routes>
    <Route>
      {landingPageRoutes}
      <Route element={<PublicRoute />}>{signUpRoutes}</Route>
      <Route element={<PrivateRoute />}>{walletRoutes}</Route>
      <Route path="*" element={<Navigate to={Pages.wallet()} />} />
    </Route>
  </Routes>
);

export const crxPopupRoutes = (
  <Routes>
    <Route element={<CRXPrivateRoute />}>
      {walletRoutes}
      <Route path="*" element={<Navigate to={Pages.wallet()} />} />
    </Route>
  </Routes>
);

export const crxSignUpRoutes = (
  <Routes>
    <Route element={<CRXPublicRoute />}>
      {signUpRoutes}
      <Route path="*" element={<Navigate to={Pages.signUp()} />} />
    </Route>
    <Route path={Pages.signUpWalletCreated()} element={<WalletCreatedPage />} />
  </Routes>
);

export const getRoutes = () => {
  if (IS_CRX_POPUP) return crxPopupRoutes;
  if (IS_CRX) return crxSignUpRoutes;
  return webAppRoutes;
};
