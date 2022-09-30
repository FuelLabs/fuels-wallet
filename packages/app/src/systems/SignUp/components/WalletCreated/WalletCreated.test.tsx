import { render, screen } from '@fuel-ui/test-utils';

import { WalletCreated } from './WalletCreated';

import { TestWrapper } from '~/systems/Core';

const ACCOUNT = {
  name: 'Account 1',
  address: 'fuel0x2c8e117bcfba11c76d7db2d43464b1d2093474ef',
  publicKey: '0x00',
};

describe('WalletCreated', () => {
  it('should show account item component', () => {
    render(<WalletCreated account={ACCOUNT} />, { wrapper: TestWrapper });
    expect(screen.getByText('Account 1')).toBeInTheDocument();
    expect(screen.getByText('fuel0x...74ef')).toBeInTheDocument();
  });
});
