import { act, fireEvent, render, screen, testA11y } from '@fuel-ui/test-utils';
import { TransactionStatus } from 'fuels';
import { VITE_EXPLORER_URL } from '~/config';
import { urlJoin } from '~/systems/Core';

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
      TransactionStatus.submitted
    );
  });

  it('should show transaction Success', async () => {
    render(
      <TxHeader
        {...MOCK_TRANSACTION_CREATE}
        status={TransactionStatus.success}
      />
    );

    expect(screen.getByText(/Success/i)).toBeInTheDocument();
    expect(screen.getByLabelText('Status Circle')).toHaveAttribute(
      'data-status',
      TransactionStatus.success
    );
  });

  it('should show transaction Error', async () => {
    render(
      <TxHeader
        {...MOCK_TRANSACTION_CREATE}
        status={TransactionStatus.failure}
      />
    );

    expect(screen.getByText(/Failure/i)).toBeInTheDocument();
    expect(screen.getByLabelText('Status Circle')).toHaveAttribute(
      'data-status',
      TransactionStatus.failure
    );
  });

  // @TODO: re-add when we have explorer link updated
  it.skip('should copy transaction link', async () => {
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
      urlJoin(VITE_EXPLORER_URL, `tx/${MOCK_TRANSACTION_CREATE.id}`)
    );
  });

  it('should copy transaction id', async () => {
    render(
      <TxHeader
        {...MOCK_TRANSACTION_CREATE}
        providerUrl={process.env.VITE_FUEL_PROVIDER_URL}
      />
    );

    const btn = await screen.findByLabelText(/Copy Transaction ID/i);
    expect(btn).toBeInTheDocument();

    await act(() => fireEvent.click(btn));
    expect(await navigator.clipboard.readText()).toBe(
      MOCK_TRANSACTION_CREATE.id
    );
  });
});
