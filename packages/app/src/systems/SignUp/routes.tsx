import { Navigate, Route } from 'react-router-dom';

import { PublicRoute, PrivateRoute } from '../Core/components';
import { Pages } from '../Core/types';

import { CreateWallet, RecoverWallet, WelcomeScreen, WalletCreatedPage } from './pages';

export const signUpRoutes = (
  <Route path={Pages.signUp()}>
    <Route element={<PublicRoute redirect={Pages.signUpWalletCreated()} />}>
      <Route index element={<Navigate to={Pages.signUpWelcome()} />} />
      <Route path={Pages.signUpWelcome()} element={<WelcomeScreen />} />
      <Route path={Pages.signUpCreateWallet()} element={<CreateWallet />} />
      <Route path={Pages.signUpRecoverWallet()} element={<RecoverWallet />} />
    </Route>
    <Route element={<PrivateRoute />}>
      <Route path={Pages.signUpWalletCreated()} element={<WalletCreatedPage />} />
    </Route>
  </Route>
);
