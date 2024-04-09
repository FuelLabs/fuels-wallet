import { fireEvent, render, screen } from '@testing-library/react';
import { TransactionStatus } from 'fuels';
import { useAssets } from '~/systems/Asset';
import { TxRequestStatus, useTransactionRequest } from '~/systems/DApp';
import { TxApprove } from './TxApprove';

const mockNavigate = jest.fn();

jest.mock('~/systems/DApp', () => ({
  ...jest.requireActual('~/systems/DApp'), // use actual for all non-hook parts
  useTransactionRequest: jest.fn(),
}));
jest.mock('~/systems/Asset/hooks/useAssets', () => ({
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

const mockUseTransactionRequest = useTransactionRequest as jest.Mock;
const mockUseAssets = useAssets as jest.Mock;

// Mocking a simplified version of the transaction result for demonstration purposes
const mockTxResult = {
  id: 'tx_123',
  status: TransactionStatus.success,
  type: 'transfer',
};

describe('TxApprove', () => {
  beforeEach(() => {
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
      status: jest.fn((status) => {
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
      txResult: mockTxResult,
      approveStatus: jest.fn().mockReturnValue(TransactionStatus.success),
      handlers: {
        closeDialog: jest.fn(),
        approve: jest.fn(),
        tryAgain: jest.fn(),
      },
      shouldShowLoader: false,
      shouldShowTx: true,
      title: 'Transaction Approval',
      providerUrl: 'https://example.com',
      ...transactionRequestOverrides,
    });

    mockUseAssets.mockReturnValue({
      assets: [],
      isLoading: false,
      ...assetsOverrides,
    });

    render(<TxApprove />);
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
    setup({}, {}, { status: TxRequestStatus.success, result: true });
    expect(screen.getByText(/success/i)).toBeDefined();
  });

  it('displays an error message when the transaction fails', () => {
    setup(
      { approveStatus: jest.fn().mockReturnValue(TransactionStatus.failure) },
      {},
      { status: TxRequestStatus.failed, result: true }
    );
    expect(screen.getByText(/failure/i)).toBeDefined();
  });

  it('does not show the approve button show actions is false', () => {
    setup({ showActions: false });
    expect(screen.queryByText(/approve/i)).toBeNull();
  });

  it('shows the try again button when the transaction has failed', () => {
    setup(
      { txResult: { ...mockTxResult, status: TransactionStatus.failure } },
      {},
      { status: TxRequestStatus.failed, result: true }
    );
    expect(screen.getByText(/try again/i)).toBeDefined();
  });

  it('calls the try again handler when try again button is clicked', () => {
    setup(
      { txResult: { ...mockTxResult, status: TransactionStatus.failure } },
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
