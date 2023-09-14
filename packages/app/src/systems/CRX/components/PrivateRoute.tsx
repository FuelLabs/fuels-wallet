import { useEffect } from 'react';
import { PrivateRoute } from '~/systems/Core';

import { welcomeLink } from '../config';
import { openTab } from '../utils';

export const OpenWelcome = () => {
  useEffect(() => {
    openTab(welcomeLink());
  }, []);

  return null;
};

export const CRXPrivateRoute = () => <PrivateRoute reject={<OpenWelcome />} />;
