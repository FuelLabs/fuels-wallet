import { render, screen } from '@fuel-ui/test-utils';

import { WalletCreated } from './WalletCreated';

import { MOCK_ACCOUNTS } from '~/systems/Account';
import { TestWrapper } from '~/systems/Core';

describe('WalletCreated', () => {
  it('should show account item component', () => {
    render(<WalletCreated account={MOCK_ACCOUNTS[0]} />, {
      wrapper: TestWrapper,
    });
    expect(screen.getByText('Account 1')).toBeInTheDocument();
    expect(screen.getByText('fuel0x...74ef')).toBeInTheDocument();
  });
});
