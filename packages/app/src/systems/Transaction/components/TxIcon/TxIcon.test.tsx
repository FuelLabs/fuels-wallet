import { render, screen, testA11y } from '@fuel-ui/test-utils';
import { TransactionType } from 'fuels';

import { TxIcon } from './TxIcon';

describe('TxIcon', () => {
  it('a11y', async () => {
    await testA11y(<TxIcon transactionType={TransactionType.Create} />);
  });

  it('should render icon correctly', async () => {
    await render(<TxIcon transactionType={TransactionType.Mint} />);
    expect(screen.getByText('DownloadSimple')).toBeInTheDocument();
    await render(<TxIcon transactionType={TransactionType.Script} />);
    expect(screen.getByText('ArrowsLeftRight')).toBeInTheDocument();
    await render(<TxIcon transactionType={TransactionType.Script} />);
    expect(screen.getByText('MagicWand')).toBeInTheDocument();
  });

  it('should render loading state correctly', async () => {
    await render(<TxIcon transactionType={TransactionType.Mint} isLoading />);
    expect(() => screen.getByText('ArrowsLeftRight')).toThrow();
    await render(<TxIcon transactionType={TransactionType.Script} />);
    expect(screen.getByText('ArrowsLeftRight')).toBeInTheDocument();
  });
});
