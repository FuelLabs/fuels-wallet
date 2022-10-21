import { Box } from '@fuel-ui/react';
import { useEffect } from 'react';

import { SignatureRequest } from './SignatureRequest';

import { createMockAccount } from '~/systems/Account';
import { NetworkService } from '~/systems/Network';

let passwordToUnlock: string;
async function loader() {
  const { password } = await createMockAccount();

  await NetworkService.clearNetworks();
  await NetworkService.addFirstNetwork();

  passwordToUnlock = password;
}

export default {
  component: SignatureRequest,
  title: 'DApp/Pages/SignatureRequest',
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
    alert(`use this password to unlock: ${passwordToUnlock}`);
  }, []);

  return (
    <Box css={{ width: 300 }}>
      <SignatureRequest />
    </Box>
  );
};
