import { useEffect } from 'react';

import { welcomeLink } from '../config';
import { openTab } from '../utils';

export const OpenWelcome = () => {
  useEffect(() => {
    openTab(welcomeLink());
  }, []);

  return null;
};
