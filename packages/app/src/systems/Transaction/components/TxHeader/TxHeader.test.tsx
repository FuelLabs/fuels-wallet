import { render, testA11y, screen } from '@fuel-ui/test-utils';
import { BLOCK_EXPLORER_URL } from '@fuel-wallet/sdk';

import {
  MOCK_TRANSACTION_CREATE,
  MOCK_TRANSACTION_SCRIPT,
} from '../../__mocks__/transaction';
import { TxStatus } from '../../types';

import { TxHeader } from './TxHeader';

describe('TxHeader', () => {
  it('a11y', async () => {
    await testA11y(<TxHeader transaction={MOCK_TRANSACTION_SCRIPT} />);
  });

  it('a11y Loader', async () => {
    await testA11y(<TxHeader.Loader />);
  });

  it('should show transaction Script', async () => {
    render(<TxHeader transaction={MOCK_TRANSACTION_SCRIPT} />);

    expect(screen.getByText(/Script/i)).toBeInTheDocument();
  });

  it('should show transaction Create', async () => {
    render(<TxHeader transaction={MOCK_TRANSACTION_CREATE} />);

    expect(screen.getByText(/Create/i)).toBeInTheDocument();
  });

  it('should show transaction Pending', async () => {
    render(<TxHeader transaction={MOCK_TRANSACTION_CREATE} />);

    expect(screen.getByText(/Pending/i)).toBeInTheDocument();
    expect(screen.getByLabelText('Status Color: amber9')).toBeInTheDocument();
  });

  it('should show transaction Success', async () => {
    render(
      <TxHeader
        transaction={{ ...MOCK_TRANSACTION_CREATE, status: TxStatus.success }}
      />
    );

    expect(screen.getByText(/Success/i)).toBeInTheDocument();
    expect(screen.getByLabelText('Status Color: mint9')).toBeInTheDocument();
  });

  it('should show transaction Error', async () => {
    render(
      <TxHeader
        transaction={{ ...MOCK_TRANSACTION_CREATE, status: TxStatus.error }}
      />
    );

    expect(screen.getByText(/Error/i)).toBeInTheDocument();
    expect(screen.getByLabelText('Status Color: crimson9')).toBeInTheDocument();
  });

  it('should copy transaction link', async () => {
    const { user } = render(
      <TxHeader
        transaction={MOCK_TRANSACTION_CREATE}
        providerUrl={process.env.VITE_FUEL_PROVIDER_URL}
      />
    );

    const btn = await screen.findByLabelText(/Copy Transaction Link/i);
    expect(btn).toBeInTheDocument();

    await user.click(btn);
    expect(await navigator.clipboard.readText()).toBe(
      `${BLOCK_EXPLORER_URL}transaction/${
        MOCK_TRANSACTION_CREATE.id
      }?providerUrl=${encodeURIComponent(
        process.env.VITE_FUEL_PROVIDER_URL || ''
      )}`
    );
  });

  it('should copy transaction id', async () => {
    const { user } = render(
      <TxHeader
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
