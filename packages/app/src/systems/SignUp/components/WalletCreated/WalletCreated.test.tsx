import { screen } from '@fuel-ui/test-utils';

import { SignUpProvider } from '../SignUpProvider';

import { WalletCreated } from './WalletCreated';

import { MOCK_ACCOUNTS } from '~/systems/Account';
import { shortAddress } from '~/systems/Core';
import { renderWithProvider } from '~/systems/Core/__tests__';

const ACCOUNT = MOCK_ACCOUNTS[0];

describe('WalletCreated', () => {
  it('should show account item component', () => {
    renderWithProvider(
      <SignUpProvider>
        <WalletCreated account={ACCOUNT} />
      </SignUpProvider>
    );
    expect(screen.getByText('Account 1')).toBeInTheDocument();
    expect(screen.getByText(shortAddress(ACCOUNT.address))).toBeInTheDocument();
  });
});
