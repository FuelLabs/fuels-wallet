import { render, screen } from '@fuel-ui/test-utils';

import { WalletCreated } from './WalletCreated';

import { MOCK_ACCOUNTS } from '~/systems/Account';
import { shortAddress, TestWrapper } from '~/systems/Core';

const ACCOUNT = MOCK_ACCOUNTS[0];

describe('WalletCreated', () => {
  it('should show account item component', () => {
    render(<WalletCreated account={ACCOUNT} />, {
      wrapper: TestWrapper,
    });
    expect(screen.getByText('Account 1')).toBeInTheDocument();
    expect(screen.getByText(shortAddress(ACCOUNT.address))).toBeInTheDocument();
  });
});
