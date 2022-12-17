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

  // it('should render both cards correctly and dont have spinner', async () => {
  //   render(<TxOperations {...PROPS} />);
  //   expect(screen.getByText('From')).toBeInTheDocument();
  //   expect(screen.getByText('fuel1y...y6wk')).toBeInTheDocument();
  //   expect(screen.getByText('To (Contract)')).toBeInTheDocument();
  //   expect(screen.getByText('0x277f...207c')).toBeInTheDocument();
  //   expect(() => screen.getByLabelText('Loading Spinner')).toThrow();
  // });
});
