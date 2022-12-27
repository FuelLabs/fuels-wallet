import { render, testA11y, screen } from '@fuel-ui/test-utils';

import { MOCK_TRANSACTION_CONTRACT_CALL } from '../../__mocks__/tx';

import { ActivityItem } from './ActivityItem';

describe('TxItem', () => {
  it('a11y', async () => {
    await testA11y(
      <ActivityItem transaction={MOCK_TRANSACTION_CONTRACT_CALL.tx} />
    );
  });

  it('a11y Loader', async () => {
    await testA11y(<ActivityItem.Loader />);
  });

  it('should copy transaction id', async () => {
    const { user } = render(
      <ActivityItem transaction={MOCK_TRANSACTION_CONTRACT_CALL.tx} />
    );

    const btn = await screen.findByLabelText(/Copy Transaction ID/i);
    expect(btn).toBeInTheDocument();

    await user.click(btn);
    expect(await navigator.clipboard.readText()).toBe(
      MOCK_TRANSACTION_CONTRACT_CALL.tx.id
    );
  });
});
