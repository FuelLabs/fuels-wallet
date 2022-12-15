import { render, screen, testA11y } from '@fuel-ui/test-utils';
import { TransactionType } from '@fuel-wallet/types';

import { TxIcon } from './TxIcon';

describe('TxIcon', () => {
  it('a11y', async () => {
    await testA11y(<TxIcon type={TransactionType.Receive} />);
  });

  it('should render icon correctly', async () => {
    await render(<TxIcon type={TransactionType.Receive} />);
    expect(screen.getByText('DownloadSimple')).toBeInTheDocument();
    await render(<TxIcon type={TransactionType.ContractCall} />);
    expect(screen.getByText('ArrowsLeftRight')).toBeInTheDocument();
    await render(<TxIcon type={TransactionType.Script} />);
    expect(screen.getByText('MagicWand')).toBeInTheDocument();
  });

  it('should render loading state correctly', async () => {
    await render(<TxIcon type={TransactionType.ContractCall} isLoading />);
    expect(() => screen.getByText('ArrowsLeftRight')).toThrow();
    await render(<TxIcon type={TransactionType.ContractCall} />);
    expect(screen.getByText('ArrowsLeftRight')).toBeInTheDocument();
  });
});
