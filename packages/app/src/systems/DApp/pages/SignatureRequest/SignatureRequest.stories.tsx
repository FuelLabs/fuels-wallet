import { Box } from '@fuel-ui/react';
import { useEffect } from 'react';
import { createMockAccount } from '~/systems/Account';

import { SignatureRequest } from './SignatureRequest';

let passwordToUnlock: string;
async function loader() {
  const { password } = await createMockAccount();
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
