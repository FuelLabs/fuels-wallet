import { Navigate, Route, Routes } from 'react-router-dom';

import { Pages } from '~/systems/Core';
import { signUpRoutes } from '~/systems/SignUp';
import { WalletCreatedPage } from '~/systems/SignUp/pages';

export const routes = (
  <Routes>
    <Route>{signUpRoutes}</Route>
    <Route path={Pages.signUpWalletCreated()} element={<WalletCreatedPage />} />
    <Route path="*" element={<Navigate to={Pages.signUpWelcome()} />} />
  </Routes>
);
