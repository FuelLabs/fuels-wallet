import { screen, testA11y } from '@fuel-ui/test-utils';

import { MOCK_ACCOUNTS } from '../../__mocks__';

import { BalanceWidget } from './BalanceWidget';

import { shortAddress, TestWrapper } from '~/systems/Core';
import { renderWithProvider } from '~/systems/Core/__tests__/utils';

const ACCOUNT = {
  ...MOCK_ACCOUNTS[0],
  balance: '4999989994',
  balanceSymbol: 'ETH',
};

describe('BalanceWidget', () => {
  it('a11y', async () => {
    await testA11y(<BalanceWidget account={ACCOUNT} />, {
      wrapper: TestWrapper,
    });
  });

  it('should show account name and user address', () => {
    renderWithProvider(<BalanceWidget account={ACCOUNT} />);
    expect(screen.getByText(ACCOUNT.name)).toBeInTheDocument();
    expect(screen.getByText(shortAddress(ACCOUNT.address))).toBeInTheDocument();
  });

  it('should show formatted balance', async () => {
    renderWithProvider(<BalanceWidget account={ACCOUNT} />);
    expect(screen.getByText(/4\.999/)).toBeInTheDocument();
  });

  it('should hide balance when user sets his balance to hide', async () => {
    const onChangeVisibility = jest.fn();
    const { user } = renderWithProvider(
      <BalanceWidget
        onChangeVisibility={onChangeVisibility}
        account={ACCOUNT}
      />
    );
    const btn = screen.getByLabelText(/Hide balance/i);
    expect(btn).toBeInTheDocument();
    await user.click(btn);
    expect(onChangeVisibility).toHaveBeenNthCalledWith(1, false);
  });

  it('should show balance when user sets his balance to show', async () => {
    const onChangeVisibility = jest.fn();
    const { user } = renderWithProvider(
      <BalanceWidget
        account={ACCOUNT}
        visibility={false}
        onChangeVisibility={onChangeVisibility}
      />
    );
    const btn = screen.getByLabelText(/Show balance/i);
    expect(btn).toBeInTheDocument();
    await user.click(btn);
    expect(onChangeVisibility).toHaveBeenNthCalledWith(1, true);
  });

  it('should copy full address when click on copy icon', async () => {
    const { user } = renderWithProvider(<BalanceWidget account={ACCOUNT} />);
    const btn = screen.getByLabelText(/copy to clipboard/i);
    expect(btn).toBeInTheDocument();

    await user.click(btn);
    expect(await navigator.clipboard.readText()).toBe(ACCOUNT.address);
  });
});
