import { Box } from '@fuel-ui/react';

import { MOCK_NETWORKS } from '../../__mocks__/networks';
import { useNetworkForm } from '../../hooks';

import { NetworkForm } from './NetworkForm';

export default {
  component: NetworkForm,
  title: 'Network/components/NetworkForm',
};

export const Usage = () => {
  const form = useNetworkForm();
  return (
    <Box css={{ width: 320 }}>
      <NetworkForm form={form} />
    </Box>
  );
};

export const WithValues = () => {
  const form = useNetworkForm({
    defaultValues: MOCK_NETWORKS[0],
  });
  return (
    <Box css={{ width: 320 }}>
      <NetworkForm form={form} />
    </Box>
  );
};
