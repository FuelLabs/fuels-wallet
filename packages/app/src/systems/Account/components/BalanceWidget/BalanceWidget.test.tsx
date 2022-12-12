import { render, screen, testA11y } from '@fuel-ui/test-utils';

import { MOCK_ACCOUNTS } from '../../__mocks__';

import { BalanceWidget } from './BalanceWidget';

import { RouterProvider } from '~/systems/Core';

const ACCOUNT = {
  ...MOCK_ACCOUNTS[0],
  balance: '4999989994',
  balanceSymbol: 'ETH',
};

describe('BalanceWidget', () => {
  it('a11y', async () => {
    await testA11y(
      <RouterProvider>
        <BalanceWidget account={ACCOUNT} />
      </RouterProvider>
    );
  });

  it('should show user address', () => {
    render(
      <RouterProvider>
        <BalanceWidget account={ACCOUNT} />
      </RouterProvider>
    );
    expect(screen.getByText('fuel0x...74ef')).toBeInTheDocument();
  });

  it('should show formatted balance', async () => {
    render(
      <RouterProvider>
        <BalanceWidget account={ACCOUNT} />
      </RouterProvider>
    );
    expect(screen.getByText(/4\.999/)).toBeInTheDocument();
  });

  it('should hide balance when click on toggle button', async () => {
    const { user } = render(
      <RouterProvider>
        <BalanceWidget account={ACCOUNT} />
      </RouterProvider>
    );
    const btn = screen.getByLabelText(/Hide balance/i);
    expect(btn).toBeInTheDocument();

    expect(screen.getByText(/4\.999/)).toBeInTheDocument();
    await user.click(btn);
    expect(() => screen.getByText(/4\.999/)).toThrow();
  });

  it('should hide balalnce when user sets his balance to hidden', async () => {
    const onChangeVisibility = jest.fn();
    const { user } = render(
      <RouterProvider>
        <BalanceWidget
          account={ACCOUNT}
          isHidden={true}
          onChangeVisibility={onChangeVisibility}
        />
      </RouterProvider>
    );
    const btn = screen.getByLabelText(/Show balance/i);
    expect(btn).toBeInTheDocument();

    expect(() => screen.getByText(/4\.999/)).toThrow();
    await user.click(btn);
    expect(onChangeVisibility).toBeCalledTimes(1);
    expect(screen.getByText(/4\.999/)).toBeInTheDocument();
  });

  it('should copy full address when click on copy icon', async () => {
    const { user } = render(
      <RouterProvider>
        <BalanceWidget account={ACCOUNT} />
      </RouterProvider>
    );
    const btn = screen.getByLabelText(/copy to clipboard/i);
    expect(btn).toBeInTheDocument();

    await user.click(btn);
    expect(await navigator.clipboard.readText()).toBe(ACCOUNT.address);
  });
});
