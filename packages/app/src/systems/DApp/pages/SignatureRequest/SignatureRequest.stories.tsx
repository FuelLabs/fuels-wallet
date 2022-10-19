import { Box } from '@fuel-ui/react';

import { SignatureRequest } from './SignatureRequest';

export default {
  component: SignatureRequest,
  title: 'DApp/Components/SignatureRequest',
};

export const Usage = () => (
  <Box css={{ width: 300 }}>
    <SignatureRequest />
  </Box>
);
