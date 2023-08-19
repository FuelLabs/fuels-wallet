import { render, testA11y, screen, act, fireEvent } from '@fuel-ui/test-utils';
import { BLOCK_EXPLORER_URL } from '@fuel-wallet/sdk';
import { SimplifiedTransactionStatusNameEnum } from 'fuels';

import {
  MOCK_TRANSACTION_CREATE,
  MOCK_TRANSACTION_SCRIPT,
} from '../../__mocks__/transaction';

import { TxHeader } from './TxHeader';

describe('TxHeader', () => {
  it('a11y', async () => {
    await testA11y(<TxHeader {...MOCK_TRANSACTION_SCRIPT} />);
  });

  it('a11y Loader', async () => {
    await testA11y(<TxHeader.Loader />);
  });

  it('should show transaction Script', async () => {
    render(<TxHeader {...MOCK_TRANSACTION_SCRIPT} />);

    expect(screen.getByText(/Script/i)).toBeInTheDocument();
  });

  it('should show transaction Create', async () => {
    render(<TxHeader {...MOCK_TRANSACTION_CREATE} />);

    expect(screen.getByText(/Create/i)).toBeInTheDocument();
  });

  it('should show transaction Submitted', async () => {
    render(<TxHeader {...MOCK_TRANSACTION_CREATE} />);

    expect(screen.getByText(/Submitted/i)).toBeInTheDocument();
    expect(screen.getByLabelText('Status Circle')).toHaveAttribute(
      'data-status',
      SimplifiedTransactionStatusNameEnum.submitted
    );
  });

  it('should show transaction Success', async () => {
    render(
      <TxHeader
        {...MOCK_TRANSACTION_CREATE}
        status={SimplifiedTransactionStatusNameEnum.success}
      />
    );

    expect(screen.getByText(/Success/i)).toBeInTheDocument();
    expect(screen.getByLabelText('Status Circle')).toHaveAttribute(
      'data-status',
      SimplifiedTransactionStatusNameEnum.success
    );
  });

  it('should show transaction Error', async () => {
    render(
      <TxHeader
        {...MOCK_TRANSACTION_CREATE}
        status={SimplifiedTransactionStatusNameEnum.failure}
      />
    );

    expect(screen.getByText(/Failure/i)).toBeInTheDocument();
    expect(screen.getByLabelText('Status Circle')).toHaveAttribute(
      'data-status',
      SimplifiedTransactionStatusNameEnum.failure
    );
  });

  it('should copy transaction link', async () => {
    render(
      <TxHeader
        {...MOCK_TRANSACTION_CREATE}
        providerUrl={process.env.VITE_FUEL_PROVIDER_URL}
      />
    );

    const btn = await screen.findByLabelText(/Copy Transaction Link/i);
    expect(btn).toBeInTheDocument();

    await act(() => fireEvent.click(btn));
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
        {...MOCK_TRANSACTION_CREATE}
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
