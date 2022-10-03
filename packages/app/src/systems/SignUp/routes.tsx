import { Navigate, Route } from 'react-router-dom';

import { Pages } from '../Core/types';

import { CreateWallet, RecoverWallet, WelcomeScreen } from './pages';

export const signUpRoutes = (
  <Route path={Pages.signUp()}>
    <Route index element={<Navigate to={Pages.signUpWelcome()} />} />
    <Route path={Pages.signUpWelcome()} element={<WelcomeScreen />} />
    <Route path={Pages.signUpCreateWallet()} element={<CreateWallet />} />
    <Route path={Pages.signUpRecoverWallet()} element={<RecoverWallet />} />
  </Route>
);
