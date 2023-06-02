import { render, screen, testA11y } from '@fuel-ui/test-utils';

import {
  MOCK_OPERATION_CONTRACT_CALL,
  MOCK_OPERATION_TRANSFER,
} from '../../__mocks__/operation';

import { TxIcon } from './TxIcon';

describe('TxIcon', () => {
  it('a11y', async () => {
    await testA11y(<TxIcon operation={MOCK_OPERATION_CONTRACT_CALL} />);
  });

  it('should render icon correctly', async () => {
    render(<TxIcon operation={MOCK_OPERATION_TRANSFER} />);
    expect(screen.getByText(/Download/)).toBeInTheDocument();
    render(<TxIcon operation={MOCK_OPERATION_CONTRACT_CALL} />);
    expect(screen.getByText(/ArrowsLeftRight/)).toBeInTheDocument();
  });
});
