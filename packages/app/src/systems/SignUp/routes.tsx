import { Navigate, Route } from 'react-router-dom';

import { useIsSigningUp } from '../Core/hooks/useIsSigningUp';
import { Pages } from '../Core/types';

import { CreateWallet, RecoverWallet, WelcomeScreen } from './pages';

const isSigningUp = useIsSigningUp();
const initialPage = isSigningUp
  ? Pages.signUpCreateWallet()
  : Pages.signUpWelcome();

export const signUpRoutes = (
  <Route path={Pages.signUp()}>
    <Route index element={<Navigate to={initialPage} />} />
    <Route path={Pages.signUpWelcome()} element={<WelcomeScreen />} />
    <Route path={Pages.signUpCreateWallet()} element={<CreateWallet />} />
    <Route path={Pages.signUpRecoverWallet()} element={<RecoverWallet />} />
  </Route>
);
