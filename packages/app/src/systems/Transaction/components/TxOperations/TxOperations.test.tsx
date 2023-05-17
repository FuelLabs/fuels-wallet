import { testA11y } from '@fuel-ui/test-utils';
import { AssetList } from 'asset-list';

import {
  MOCK_OPERATION_CONTRACT_CALL,
  MOCK_OPERATION_TRANSFER,
} from '../../__mocks__/operation';

import { TxOperations } from './TxOperations';

import { TestWrapper } from '~/systems/Core';

const PROPS = {
  operations: [MOCK_OPERATION_CONTRACT_CALL, MOCK_OPERATION_TRANSFER],
  assets: AssetList,
};

describe('TxOperation', () => {
  it('a11y', async () => {
    await testA11y(<TxOperations {...PROPS} />, { wrapper: TestWrapper });
  });
});
