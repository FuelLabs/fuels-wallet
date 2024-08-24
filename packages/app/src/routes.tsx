import * as Sentry from '@sentry/react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { assetRoutes } from '~/systems/Asset';
import { PrivateRoute, PublicRoute } from '~/systems/Core';
import { Pages } from '~/systems/Core/types';
import { homeRoutes } from '~/systems/Home';
import { signUpRoutes } from '~/systems/SignUp';

import { errorRoutes } from '~/systems/Error/routes';
import { IS_CRX, IS_CRX_POPUP } from './config';
import { CRXPrivateRoute, CRXPublicRoute } from './systems/CRX/components';
import { dappRoutes } from './systems/DApp/routes';
import { sendRoutes } from './systems/Send';
import { settingsRoutes } from './systems/Settings';
import { transactionRoutes } from './systems/Transaction/routes';
import { UnlockGuard } from './systems/Unlock';

const SentryRoutes = Sentry.withSentryReactRouterV6Routing(Routes);

const walletRoutes = (
  <>
    {errorRoutes}
    {homeRoutes}
    {settingsRoutes}
    {dappRoutes}
    {sendRoutes}
    {transactionRoutes}
    {assetRoutes}
  </>
);

const initialPage = Pages.wallet();

export const webAppRoutes = (
  <SentryRoutes>
    <Route>
      <Route element={<PublicRoute />}>{signUpRoutes}</Route>
      <Route element={<PrivateRoute />}>
        <Route element={<UnlockGuard />}>
          <Route element={<Navigate to={Pages.signUpCreatedWallet()} />} />
          {walletRoutes}
        </Route>
      </Route>
      <Route path="*" element={<Navigate to={initialPage} />} />
    </Route>
  </SentryRoutes>
);

export const crxPopupRoutes = (
  <SentryRoutes>
    <Route element={<CRXPrivateRoute />}>
      <Route element={<UnlockGuard />}>
        {walletRoutes}
        <Route path="*" element={<Navigate to={initialPage} />} />
      </Route>
    </Route>
  </SentryRoutes>
);

export const crxSignUpRoutes = (
  <SentryRoutes>
    <Route element={<CRXPublicRoute />}>
      {signUpRoutes}
      <Route path="*" element={<Navigate to={Pages.signUp()} />} />
    </Route>
    <Route element={<Navigate to={Pages.signUpCreatedWallet()} />} />
  </SentryRoutes>
);

export const getRoutes = () => {
  if (IS_CRX_POPUP) return crxPopupRoutes;
  if (IS_CRX) return crxSignUpRoutes;
  return webAppRoutes;
};
