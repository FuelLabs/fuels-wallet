import { Navigate, Route } from 'react-router-dom';

import { Pages } from '../Core/types';

import { SignUpProvider } from './components/SignUpProvider';
import { HasAcceptedTermsGuard } from './guards';
import {
  CreateWallet,
  RecoverWallet,
  WelcomeScreen,
  TermsOfUse,
} from './pages';

export const signUpRoutes = (
  <Route path={Pages.signUp()} element={<SignUpProvider />}>
    <Route index element={<Navigate to={Pages.signUpWelcome()} />} />
    <Route path={Pages.signUpWelcome()} element={<WelcomeScreen />} />
    <Route path={Pages.signUpTerms()} element={<TermsOfUse />} />
    <Route element={<HasAcceptedTermsGuard />}>
      <Route path={Pages.signUpCreateWallet()} element={<CreateWallet />} />
      <Route path={Pages.signUpRecoverWallet()} element={<RecoverWallet />} />
    </Route>
  </Route>
);
