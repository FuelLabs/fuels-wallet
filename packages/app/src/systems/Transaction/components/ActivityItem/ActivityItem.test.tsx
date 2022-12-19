import { render, testA11y, screen } from '@fuel-ui/test-utils';

import {
  MOCK_TRANSACTION_CREATE,
  MOCK_TRANSACTION_SCRIPT,
} from '../../__mocks__/transaction';

import { ActivityItem } from './ActivityItem';

describe('TxItem', () => {
  it('a11y', async () => {
    await testA11y(<ActivityItem transaction={MOCK_TRANSACTION_SCRIPT} />);
  });

  it('a11y Loader', async () => {
    await testA11y(<ActivityItem.Loader />);
  });

  it('should show transaction Script', async () => {
    render(<ActivityItem transaction={MOCK_TRANSACTION_SCRIPT} />);

    expect(screen.getByText(/Script/i)).toBeInTheDocument();
  });

  it('should show transaction Create', async () => {
    render(<ActivityItem transaction={MOCK_TRANSACTION_CREATE} />);

    expect(screen.getByText(/Create/i)).toBeInTheDocument();
  });

  it('should copy transaction id', async () => {
    const { user } = render(
      <ActivityItem
        transaction={MOCK_TRANSACTION_CREATE}
        providerUrl={process.env.VITE_FUEL_PROVIDER_URL}
      />
    );

    const btn = await screen.findByLabelText(/Copy Transaction ID/i);
    expect(btn).toBeInTheDocument();

    await user.click(btn);
    expect(await navigator.clipboard.readText()).toBe(
      MOCK_TRANSACTION_CREATE.id
    );
  });
});
