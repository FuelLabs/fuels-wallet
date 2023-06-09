import { Navigate, Route } from 'react-router-dom';

import { Pages } from '../Core/types';

import { SignUpProvider } from './components/SignUpProvider';
import {
  RecoverWallet,
  WelcomeScreen,
  TermsOfUse,
  EncryptWallet,
  BackupWallet,
  ConfirmWallet,
} from './pages';

export const signUpRoutes = (
  <Route path={Pages.signUp()} element={<SignUpProvider />}>
    <Route index element={<Navigate to={Pages.signUpWelcome()} />} />
    <Route path={Pages.signUpWelcome()} element={<WelcomeScreen />} />
    <Route path={Pages.signUpTerms()} element={<TermsOfUse />} />
    <Route path={Pages.signUpCreateWallet()} element={<BackupWallet />} />
    <Route path={Pages.signUpConfirmWallet()} element={<ConfirmWallet />} />
    <Route path={Pages.signUpRecoverWallet()} element={<RecoverWallet />} />
    <Route path={Pages.signUpEncryptWallet()} element={<EncryptWallet />} />
  </Route>
);
