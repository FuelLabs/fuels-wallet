import { render, screen, testA11y } from '@fuel-ui/test-utils';

import { MOCK_ACCOUNTS } from '../../__mocks__';

import { AccountItem } from './AccountItem';

import { shortAddress } from '~/systems/Core';

const ACCOUNT = MOCK_ACCOUNTS[0];
const SHORT_ADDRESS = shortAddress(ACCOUNT.address);

describe('AccountItem', () => {
  it('a11y', async () => {
    await testA11y(<AccountItem account={ACCOUNT} />);
  });
  it('a11y Loader', async () => {
    await testA11y(<AccountItem.Loader />);
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
