import { Route } from 'react-router-dom';

import { Pages } from '../Core/types';

import { Send } from './pages';

export const sendRoutes = <Route path={Pages.send()} element={<Send />} />;
