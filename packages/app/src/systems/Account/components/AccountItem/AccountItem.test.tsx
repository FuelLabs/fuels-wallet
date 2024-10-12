import { render, screen, testA11y } from '@fuel-ui/test-utils';
import { shortAddress } from '~/systems/Core';

import { MOCK_ACCOUNTS } from '../../__mocks__';

import { Address } from 'fuels';
import { AccountItem } from './AccountItem';

const ACCOUNT = MOCK_ACCOUNTS[0];
const SHORT_ADDRESS = shortAddress(
  Address.fromDynamicInput(ACCOUNT.address).toChecksum()
);

jest.mock('~/systems/Network', () => ({
  useNetworks: jest.fn().mockReturnValue({
    selectedNetwork: {
      chainId: 1,
      name: 'Fuel Sepolia Testnet',
      url: 'https://testnet.fuel.network/v1/graphql',
      explorerUrl: 'https://testnet.fuel.network/v1/explorer',
    },
  }),
}));

describe('AccountItem', () => {
  it('a11y', async () => {
    await testA11y(<AccountItem account={ACCOUNT} />);
  });

  it('should show a name and as abbreviated address', async () => {
    render(<AccountItem account={ACCOUNT} />);
    expect(screen.getByText('Account 1')).toBeInTheDocument();
    expect(screen.getByText(SHORT_ADDRESS)).toBeInTheDocument();
  });

  it('should return null when isHidden', async () => {
    render(<AccountItem account={ACCOUNT} isHidden />);
    expect(() => screen.getByText('Account 1')).toThrow();
    expect(() => screen.getByText(SHORT_ADDRESS)).toThrow();
  });

  it('should render in compact mode', async () => {
    render(<AccountItem account={ACCOUNT} compact={true} />);
    const accountItem = await screen.findByLabelText('Account 1');
    await expect(accountItem).toHaveAttribute('data-compact', 'true');
  });
});
