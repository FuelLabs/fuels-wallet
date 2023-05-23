import { render, screen, testA11y } from '@fuel-ui/test-utils';

import { MOCK_TXS } from '../../__mocks__/transactions';

import { ActivityList } from './ActivityList';

import { MOCK_ACCOUNTS } from '~/systems/Account';
import { TestWrapper } from '~/systems/Core/components/TestWrapper';

describe('ActivityList', () => {
  it('a11y', async () => {
    await testA11y(
      <ActivityList txs={MOCK_TXS} ownerAddress={MOCK_ACCOUNTS[3].address} />,
      {
        wrapper: TestWrapper,
      }
    );
  });

  it('a11y Loader', async () => {
    await testA11y(
      <ActivityList
        txs={[]}
        isLoading={true}
        ownerAddress={MOCK_ACCOUNTS[3].address}
      />,
      {
        wrapper: TestWrapper,
      }
    );
  });

  it('a11y Empty', async () => {
    await testA11y(
      <ActivityList
        txs={[]}
        isLoading={false}
        ownerAddress={MOCK_ACCOUNTS[3].address}
      />,
      {
        wrapper: TestWrapper,
      }
    );
  });

  it('Should show empty state when there are no transactions', async () => {
    render(
      <ActivityList
        txs={[]}
        isLoading={false}
        ownerAddress={MOCK_ACCOUNTS[3].address}
      />,
      {
        wrapper: TestWrapper,
      }
    );
    expect(screen.getByText(/No activity yet/i)).toBeInTheDocument();
  });

  it('should render the same amount of activity items as transactions', async () => {
    render(
      <ActivityList
        txs={MOCK_TXS}
        isLoading={false}
        ownerAddress={MOCK_ACCOUNTS[3].address}
      />,
      {
        wrapper: TestWrapper,
      }
    );
    expect(screen.getAllByLabelText('activity-item').length).toBe(
      MOCK_TXS.length
    );
  });
});
