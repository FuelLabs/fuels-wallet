import { Route } from 'react-router-dom';
import { Pages } from '../Core/types';

import { ReviewErrors } from './pages';

export const errorRoutes = (
  <Route element={<ReviewErrors />} path={Pages.errors()} />
);
