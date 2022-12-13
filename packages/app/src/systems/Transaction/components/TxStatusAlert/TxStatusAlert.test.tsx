import { render, screen, testA11y } from '@fuel-ui/test-utils';

import { TxStatus } from '../../types';

import { TxStatusAlert } from './TxStatusAlert';

describe('TxStatusAlert', () => {
  it('a11y', async () => {
    await testA11y(<TxStatusAlert />);
  });

  it('should show transaction pending and block explorer link', async () => {
    render(<TxStatusAlert txStatus={TxStatus.pending} txId="0x123" />);

    expect(
      screen.getByText(/transaction is still pending/i)
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(/View Transaction on Block Explorer/i)
    ).toBeInTheDocument();
  });

  it('should show transaction error and block explorer link', async () => {
    render(<TxStatusAlert txStatus={TxStatus.error} txId="0x123" />);

    expect(screen.getByText(/something wrong happened/i)).toBeInTheDocument();
    expect(
      screen.getByLabelText(/View Transaction on Block Explorer/i)
    ).toBeInTheDocument();
  });

  it('should render error sent', async () => {
    const error = 'Invalid Transaction Id';
    render(<TxStatusAlert error={error} />);

    expect(screen.getByText(error)).toBeInTheDocument();
  });
});
