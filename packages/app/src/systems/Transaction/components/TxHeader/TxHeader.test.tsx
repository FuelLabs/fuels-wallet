import { render, testA11y, screen } from '@fuel-ui/test-utils';
import { BLOCK_EXPLORER_URL } from '@fuel-wallet/sdk';

import {
  MOCK_TRANSACTION_CREATE,
  MOCK_TRANSACTION_SCRIPT,
} from '../../__mocks__/transaction';
import { TxStatus } from '../../types';

import { TxHeader } from './TxHeader';

describe('TxDetails', () => {
  it('a11y', async () => {
    await testA11y(<TxHeader transaction={MOCK_TRANSACTION_SCRIPT} />);
  });

  it('should be able to show info of transaction Script', async () => {
    render(<TxHeader transaction={MOCK_TRANSACTION_SCRIPT} />);

    expect(screen.getByText(/Script/i)).toBeInTheDocument();
  });

  it('should be able to show info of transaction Create', async () => {
    render(<TxHeader transaction={MOCK_TRANSACTION_CREATE} />);

    expect(screen.getByText(/Create/i)).toBeInTheDocument();
  });

  it('should be able to show info of transaction Pending', async () => {
    render(<TxHeader transaction={MOCK_TRANSACTION_CREATE} />);

    expect(screen.getByText(/Pending/i)).toBeInTheDocument();
    expect(screen.getByLabelText('Status Color: amber9')).toBeInTheDocument();
  });

  it('should be able to show info of transaction Success', async () => {
    render(
      <TxHeader
        transaction={{ ...MOCK_TRANSACTION_CREATE, status: TxStatus.success }}
      />
    );

    expect(screen.getByText(/Success/i)).toBeInTheDocument();
    expect(screen.getByLabelText('Status Color: mint9')).toBeInTheDocument();
  });

  it('should be able to show info of transaction Error', async () => {
    render(
      <TxHeader
        transaction={{ ...MOCK_TRANSACTION_CREATE, status: TxStatus.error }}
      />
    );

    expect(screen.getByText(/Error/i)).toBeInTheDocument();
    expect(screen.getByLabelText('Status Color: crimson9')).toBeInTheDocument();
  });

  it('should be able to copy transaction link', async () => {
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
      // 'https://fuellabs.github.io/block-explorer-v2/transaction/12132213231231?providerUrl=http%3A%2F%2Flocalhost%3A4001%2Fgraphql'
    );
  });

  it('should be able to copy transaction id', async () => {
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
