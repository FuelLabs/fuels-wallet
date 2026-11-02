import { Route } from 'react-router-dom';

import { Pages } from '../Core/types';

import { lazyPage } from '~/systems/Core/utils/lazyPage';

const SendPage = lazyPage(() =>
  import('./pages/SendPage').then((m) => m.SendPage)
);

export const sendRoutes = <Route path={Pages.send()} element={<SendPage />} />;
