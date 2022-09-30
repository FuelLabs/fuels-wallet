import { Navigate, Route, Routes } from 'react-router-dom';

import { Pages } from '~/systems/Core/types';
import { homeRoutes } from '~/systems/Home/routes';
import { landingPageRoutes } from '~/systems/LandingPage/routes';
import { networkRoutes } from '~/systems/Network/routes';
import { signUpRoutes } from '~/systems/SignUp/routes';

export const routes = (
  <Routes>
    <Route>
      {landingPageRoutes}
      {homeRoutes}
      {networkRoutes}
      {signUpRoutes}
      <Route path="*" element={<Navigate to={Pages.home()} />} />
    </Route>
  </Routes>
);
