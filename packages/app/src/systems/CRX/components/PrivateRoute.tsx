import { useEffect } from 'react';

import { welcomeLink } from '../config';
import { openTab } from '../utils';

import { PrivateRoute } from '~/systems/Core';

export const OpenWelcome = () => {
  useEffect(() => {
    openTab(welcomeLink());
  }, []);

  return null;
};

export const CRXPrivateRoute = () => <PrivateRoute reject={<OpenWelcome />} />;
