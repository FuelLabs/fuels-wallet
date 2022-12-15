import { Box } from '@fuel-ui/react';

import { getGroupedErrors } from '../../utils';

import { TxErrors } from './TxErrors';

export default {
  component: TxErrors,
  title: 'Transaction/Components/TxErrors',
};

const ERRORS = getGroupedErrors([
  { message: 'ExampleError: an example of error' },
]);

export const Usage = () => (
  <Box css={{ maxWidth: 300 }}>
    <TxErrors errors={ERRORS} />
  </Box>
);
