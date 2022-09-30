import { Navigate, Route, Routes } from 'react-router-dom';

import { PageLinks } from '~/systems/Core';
import { signUpRoutes } from '~/systems/SignUp';
import { WalletCreatedPage } from '~/systems/SignUp/pages';

export const routes = (
  <Routes>
    <Route>{signUpRoutes}</Route>
    <Route path={PageLinks.signUpWalletCreated} element={<WalletCreatedPage />} />
    <Route path="*" element={<Navigate to={PageLinks.signUpWelcome} />} />
  </Routes>
);
