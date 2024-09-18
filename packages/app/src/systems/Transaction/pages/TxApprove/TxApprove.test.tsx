import { fireEvent, render, screen } from '@testing-library/react';
import { TransactionStatus, bn } from 'fuels';
import { TxRequestStatus } from '~/systems/DApp/machines/transactionRequestMachine';
import { TxApprove } from './TxApprove';

const mockNavigate = jest.fn();

jest.mock('~/systems/DApp', () => ({
  useTransactionRequest: jest.fn(),
}));
jest.mock('~/systems/Asset', () => ({
  useAssets: jest.fn(),
}));
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'), // use actual for all non-hook parts
  useNavigate: () => ({ navigate: mockNavigate }),
}));
jest.mock('~/systems/Store', () => ({
  store: {
    refreshNetworks: jest.fn(),
    refreshAccounts: jest.fn(),
    refreshBalance: jest.fn(),
  },
  StoreProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

import { useAssets } from '~/systems/Asset';
import { useTransactionRequest } from '~/systems/DApp';
import { FormProvider } from '~/systems/DApp/pages/TransactionRequest/TransactionRequest.FormProvider';

const mockUseTransactionRequest = useTransactionRequest as jest.Mock;
const mockUseAssets = useAssets as jest.Mock;

const mockTxResult = {
  id: 'tx_123',
  status: TransactionStatus.success,
  type: 'transfer',
};

describe('TxApprove', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const setup = (
    transactionRequestOverrides = {},
    assetsOverrides = {},
    mockStatus?: { status: TxRequestStatus; result: boolean }
  ) => {
    const mockCustomStatus = mockStatus?.status ?? 'never';
    mockUseTransactionRequest.mockReturnValue({
      isLoading: false,
      showActions: true,
      status: jest.fn().mockImplementation((status) => {
        switch (status) {
          case mockCustomStatus:
            if (!mockStatus?.status) {
              throw new Error('Invalid mock status');
            }
            return mockStatus?.result ?? false;
          case 'sending':
            return false;
          case 'success':
            return false;
          case 'failed':
            return false;
          case 'idle':
            return true;
          default:
            return false;
        }
      }),
      shouldShowTxSimulated: true,
      shouldShowTxExecuted: false,
      shouldShowActions: true,
      simulateTxErrors: 'Unknown error',
      txSummarySimulated: mockTxResult,
      approveStatus: jest.fn().mockReturnValue(TransactionStatus.success),
      handlers: {
        closeDialog: jest.fn(),
        approve: jest.fn(),
        tryAgain: jest.fn(),
      },
      shouldShowTx: true,
      title: 'Transaction Approval',
      providerUrl: 'https://example.com',
      errors: {},
      ...transactionRequestOverrides,
    });

    mockUseAssets.mockReturnValue({
      assets: [],
      isLoading: false,
      ...assetsOverrides,
    });

    render(
      <FormProvider
        testId=""
        defaultValues={{
          fees: {
            tip: {
              amount: bn(0),
              text: '0',
            },
            gasLimit: {
              amount: bn(53),
              text: '53',
            },
          },
        }}
        onSubmit={jest.fn()}
        context={{
          baseFee: undefined,
          minGasLimit: undefined,
          maxGasLimit: undefined,
        }}
      >
        <TxApprove />
      </FormProvider>
    );
  };

  it('calls the approve handler when approve button is clicked', () => {
    setup();
    const approveButton = screen.getByText(/approve/i);
    fireEvent.click(approveButton);
    expect(mockUseTransactionRequest().handlers.approve).toHaveBeenCalled();
  });

  it('displays a loading indicator when assets are loading', () => {
    setup(
      {},
      { isLoading: true },
      { status: TxRequestStatus.idle, result: true }
    );
    expect(screen.getByText(/loading/i)).toBeDefined();
  });

  it('displays a loading indicator when status is sending', () => {
    setup({}, {}, { status: TxRequestStatus.sending, result: true });
    expect(screen.getByText(/loading/i)).toBeDefined();
  });

  it('displays a loading indicator when the transaction is being processed', () => {
    setup({}, {}, { status: TxRequestStatus.loading, result: true });
    expect(screen.getByText(/loading/i)).toBeDefined();
  });

  it('displays success when a transaction was completed', () => {
    setup(
      {
        shouldShowTxSimulated: false,
        shouldShowActions: false,
        shouldShowTxExecuted: true,
        txSummaryExecuted: mockTxResult,
        executedStatus: () => TransactionStatus.success,
      },
      {},
      { status: TxRequestStatus.success, result: true }
    );
    expect(screen.getByText(/success/i)).toBeDefined();
  });

  it('displays an error message when the transaction fails', () => {
    setup(
      {
        errors: {
          simulateTxErrors: 'Insufficient Input Amount',
        },
      },
      {},
      { status: TxRequestStatus.failed, result: true }
    );
    expect(screen.getByText('Insufficient Input Amount')).toBeDefined();
  });

  it('does not show the approve button show actions is false', () => {
    setup({ shouldShowActions: false });
    expect(screen.queryByText(/approve/i)).toBeNull();
  });

  it('shows the try again button when the transaction has failed', () => {
    setup(
      {
        shouldShowTxExecuted: true,
        executedStatus: () => TransactionStatus.failure,
        txSummaryExecuted: {
          ...mockTxResult,
          status: TransactionStatus.failure,
        },
      },
      {},
      { status: TxRequestStatus.failed, result: true }
    );
    expect(screen.getByText(/try again/i)).toBeDefined();
  });

  it('calls the try again handler when try again button is clicked', () => {
    setup(
      {
        shouldShowTxExecuted: true,
        executedStatus: () => TransactionStatus.failure,
        txSummaryExecuted: {
          ...mockTxResult,
          status: TransactionStatus.failure,
        },
      },
      {},
      { status: TxRequestStatus.failed, result: true }
    );
    fireEvent.click(screen.getByText(/try again/i));
    expect(mockUseTransactionRequest().handlers.tryAgain).toHaveBeenCalled();
  });

  it('calls the close dialog handler when back button is clicked', () => {
    setup();
    fireEvent.click(screen.getByText(/back/i));
    expect(mockUseTransactionRequest().handlers.closeDialog).toHaveBeenCalled();
  });
});
