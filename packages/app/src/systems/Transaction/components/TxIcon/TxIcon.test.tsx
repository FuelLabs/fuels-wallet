import { screen } from '@fuel-ui/test-utils';

import {
  MOCK_OPERATION_CONTRACT_CALL,
  MOCK_OPERATION_TRANSFER,
} from '../../__mocks__/operation';

import { TxIcon } from './TxIcon';

import { TestWrapper } from '~/systems/Core';
import {
  renderWithProvider,
  testA11yWithProvider,
} from '~/systems/Core/__tests__';

describe('TxIcon', () => {
  it('a11y', async () => {
    await testA11yWithProvider(
      <TxIcon operation={MOCK_OPERATION_CONTRACT_CALL} />,
      {
        wrapper: TestWrapper,
      }
    );
  });

  it('should render icon correctly', async () => {
    renderWithProvider(<TxIcon operation={MOCK_OPERATION_TRANSFER} />);
    expect(screen.getByText(/Icon Upload/)).toBeInTheDocument();
    renderWithProvider(<TxIcon operation={MOCK_OPERATION_CONTRACT_CALL} />);
    expect(screen.getByText(/ArrowsLeftRight/)).toBeInTheDocument();
  });
});
