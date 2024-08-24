import { Navigate, Route } from 'react-router-dom';

import { Pages } from '../Core/types';

import { listenToGlobalErrors } from '~/systems/Core/utils/listenToGlobalErrors';
import { ReportErrorService } from '~/systems/Error';
import { SignUpProvider } from './components/SignUpProvider';
import {
  BackupWallet,
  ConfirmWallet,
  CreatedWallet,
  EncryptWallet,
  RecoverWallet,
  TermsOfUse,
  WelcomeScreen,
} from './pages';

listenToGlobalErrors((error) => {
  ReportErrorService.saveError(error);
});

export const signUpRoutes = (
  <Route path={Pages.signUp()} element={<SignUpProvider />}>
    <Route index element={<Navigate to={Pages.signUpWelcome()} />} />
    <Route path={Pages.signUpWelcome()} element={<WelcomeScreen />} />
    <Route path={Pages.signUpTerms()} element={<TermsOfUse />} />
    <Route path={Pages.signUpCreateWallet()} element={<BackupWallet />} />
    <Route path={Pages.signUpConfirmWallet()} element={<ConfirmWallet />} />
    <Route path={Pages.signUpRecoverWallet()} element={<RecoverWallet />} />
    <Route path={Pages.signUpEncryptWallet()} element={<EncryptWallet />} />
    <Route path={Pages.signUpCreatedWallet()} element={<CreatedWallet />} />
  </Route>
);
