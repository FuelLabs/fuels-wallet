import { Box } from '@fuel-ui/react';
import { useEffect } from 'react';

import { AddNetworkRequest } from './AddNetworkRequest';

import { createMockAccount } from '~/systems/Account';

let passwordToUnlock: string;
async function loader() {
  const { password } = await createMockAccount();
  passwordToUnlock = password;
}

export default {
  component: AddNetworkRequest,
  title: 'DApp/Pages/AddNetworkRequest',
  loaders: [loader],
  parameters: {
    layout: 'fullscreen',
    viewport: {
      defaultViewport: 'chromeExtension',
    },
  },
};

export const Usage = () => {
  useEffect(() => {
    // eslint-disable-next-line no-alert
    alert(`use this password to unlock: ${passwordToUnlock}`);
  }, []);

  return (
    <Box css={{ width: 300 }}>
      <AddNetworkRequest />
    </Box>
  );
};
