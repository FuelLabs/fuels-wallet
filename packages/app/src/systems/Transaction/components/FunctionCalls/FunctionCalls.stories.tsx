import { Box } from '@fuel-ui/react';

import { MOCK_OPERATION_CONTRACT_CALL } from '../../__mocks__/operation';

import type { FunctionCallsProps } from './FunctionCalls';
import { FunctionCalls } from './FunctionCalls';

export default {
  component: FunctionCalls,
  title: 'Asset/Components/FunctionCalls',
};

export const Single = (args: FunctionCallsProps) => (
  <Box css={{ maxWidth: 300 }}>
    <FunctionCalls {...args} calls={MOCK_OPERATION_CONTRACT_CALL.calls || []} />
  </Box>
);
