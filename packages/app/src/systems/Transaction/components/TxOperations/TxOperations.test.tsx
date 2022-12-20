import { testA11y } from '@fuel-ui/test-utils';

import { MOCK_OPERATION } from '../../__mocks__/operation';

import { TxOperations } from './TxOperations';

const PROPS = {
  operations: [MOCK_OPERATION, MOCK_OPERATION],
};

describe('TxOperation', () => {
  it('a11y', async () => {
    await testA11y(<TxOperations {...PROPS} />);
  });
});
