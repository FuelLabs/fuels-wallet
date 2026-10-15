import { Navigate, Route } from 'react-router-dom';

import { Pages } from '../Core/types';

import { lazyPage } from '~/systems/Core/utils/lazyPage';
import { listenToGlobalErrors } from '~/systems/Core/utils/listenToGlobalErrors';
import { ReportErrorService } from '~/systems/Error';
import { SignUpProvider } from './components/SignUpProvider';

const BackupWallet = lazyPage(() =>
  import('./pages/BackupWallet').then((m) => m.BackupWallet)
);
const ConfirmWallet = lazyPage(() =>
  import('./pages/ConfirmWallet').then((m) => m.ConfirmWallet)
);
const CreatedWallet = lazyPage(() =>
  import('./pages/CreatedWallet').then((m) => m.CreatedWallet)
);
const EncryptWallet = lazyPage(() =>
  import('./pages/EncryptWallet').then((m) => m.EncryptWallet)
);
const RecoverWallet = lazyPage(() =>
  import('./pages/RecoverWallet').then((m) => m.RecoverWallet)
);
const TermsOfUse = lazyPage(() =>
  import('./pages/TermsOfUse').then((m) => m.TermsOfUse)
);
const WelcomeScreen = lazyPage(() =>
  import('./pages/WelcomeScreen').then((m) => m.WelcomeScreen)
);

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
