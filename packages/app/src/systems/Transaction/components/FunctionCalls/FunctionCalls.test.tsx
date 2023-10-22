import { testA11y } from '@fuel-ui/test-utils';

import { MOCK_OPERATION_CONTRACT_CALL } from '../../__mocks__/operation';

import { FunctionCalls } from './FunctionCalls';

describe('FunctionCalls', () => {
  it('a11y', async () => {
    await testA11y(
      <FunctionCalls calls={MOCK_OPERATION_CONTRACT_CALL.calls || []} />
    );
  });
});
