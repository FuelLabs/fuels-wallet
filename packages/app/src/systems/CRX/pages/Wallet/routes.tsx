import { Navigate, Route, Routes } from 'react-router-dom';

import { Pages } from '~/systems/Core';
import { homeRoutes } from '~/systems/Home';

export const routes = (
  <Routes>
    <Route>
      {homeRoutes}
      <Route path="*" element={<Navigate to={Pages.wallet} />} />
    </Route>
  </Routes>
);
