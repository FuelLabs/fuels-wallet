import { Route } from 'react-router-dom';

import { Pages } from '../Core/types';

import { SendPage } from './pages';

export const sendRoutes = <Route path={Pages.send()} element={<SendPage />} />;
