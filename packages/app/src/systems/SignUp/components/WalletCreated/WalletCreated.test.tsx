import { screen } from '@fuel-ui/test-utils';
import { MOCK_ACCOUNTS } from '~/systems/Account';
import type { TestWrapperProps } from '~/systems/Core';
import { TestWrapper, shortAddress } from '~/systems/Core';
import { renderWithProvider } from '~/systems/Core/__tests__';

import { SignUpProvider } from '../SignUpProvider';

import { Address } from 'fuels';
import { WalletCreated } from './WalletCreated';

const ACCOUNT = MOCK_ACCOUNTS[0];

const renderOpts = {
  wrapper: ({ children }: TestWrapperProps) => (
    <TestWrapper>
      <SignUpProvider>{children}</SignUpProvider>
    </TestWrapper>
  ),
};

describe('WalletCreated', () => {
  it('should show account item component', () => {
    renderWithProvider(<WalletCreated account={ACCOUNT} />, renderOpts);
    expect(screen.getByText('Account 1')).toBeInTheDocument();
    expect(
      screen.getByText(
        shortAddress(Address.fromDynamicInput(ACCOUNT.address).toB256())
      )
    ).toBeInTheDocument();
  });
});
