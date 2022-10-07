import { render, screen, testA11y } from '@fuel-ui/test-utils';

import { MOCK_ACCOUNTS } from '../../__mocks__';

import { BalanceWidget } from './BalanceWidget';

const ACCOUNT = {
  ...MOCK_ACCOUNTS[0],
  balance: '12008943834',
  balanceSymbol: '$',
};

describe('BalanceWidget', () => {
  it('a11y', async () => {
    await testA11y(<BalanceWidget account={ACCOUNT} />);
  });

  it('should show user address', () => {
    render(<BalanceWidget account={ACCOUNT} />);
    expect(screen.getByText('fuel0x...74ef')).toBeInTheDocument();
  });

  it('should show formatted balance', () => {
    render(<BalanceWidget account={ACCOUNT} />);
    expect(screen.getByText(/12,009/)).toBeInTheDocument();
  });

  it('should hide balance when click on toggle button', async () => {
    const { user } = render(<BalanceWidget account={ACCOUNT} />);
    const btn = screen.getByLabelText(/Hide balance/i);
    expect(btn).toBeInTheDocument();

    expect(screen.getByText(/12,009/)).toBeInTheDocument();
    await user.click(btn);
    expect(() => screen.getByText(/12,009/)).toThrow();
  });

  it('should copy full address when click on copy icon', async () => {
    const { user } = render(<BalanceWidget account={ACCOUNT} />);
    const btn = screen.getByLabelText(/copy to clipboard/i);
    expect(btn).toBeInTheDocument();

    await user.click(btn);
    expect(await navigator.clipboard.readText()).toBe(ACCOUNT.address);
  });
});
