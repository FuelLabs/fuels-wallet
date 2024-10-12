import { screen, testA11y } from '@fuel-ui/test-utils';
import { fireEvent } from '@storybook/testing-library';

import { TestWrapper, shortAddress } from '~/systems/Core';
import { renderWithProvider } from '~/systems/Core/__tests__/utils';

import { MOCK_ACCOUNTS } from '../../__mocks__';

import type { AccountWithBalance } from '@fuel-wallet/types';
import { Address, bn } from 'fuels';
import { act } from 'react';
import { BalanceWidget } from './BalanceWidget';

const ACCOUNT: AccountWithBalance = {
  ...MOCK_ACCOUNTS[0],
  balance: bn(4999989994),
  balanceSymbol: 'ETH',
  balances: [],
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
    expect(
      screen.getByText(
        shortAddress(Address.fromDynamicInput(ACCOUNT.address).toString())
      )
    ).toBeInTheDocument();
  });

  it('should show formatted balance', async () => {
    renderWithProvider(<BalanceWidget account={ACCOUNT} />);
    expect(screen.getByText(/4\.999/)).toBeInTheDocument();
  });

  it('should hide balance when user sets his balance to hide', async () => {
    const onChangeVisibility = jest.fn();
    renderWithProvider(
      <BalanceWidget
        onChangeVisibility={onChangeVisibility}
        account={ACCOUNT}
      />
    );
    const btn = screen.getByLabelText(/Hide balance/i);
    expect(btn).toBeInTheDocument();
    fireEvent.click(btn);
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
    renderWithProvider(<BalanceWidget account={ACCOUNT} />);
    const btn = screen.getByLabelText(/copy to clipboard/i);
    expect(btn).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(btn);
      expect(await navigator.clipboard.readText()).toBe(
        Address.fromDynamicInput(ACCOUNT.address).toString()
      );
    });
  });
});
