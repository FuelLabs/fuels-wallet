import { render, screen, testA11y } from '@fuel-ui/test-utils';

import { TxType } from '../../types';

import { TxIcon } from './TxIcon';

describe('TxIcon', () => {
  it('a11y', async () => {
    await testA11y(<TxIcon transactionType={TxType.RECEIVE} />);
  });

  it('should render icon correctly', async () => {
    await render(<TxIcon transactionType={TxType.RECEIVE} />);
    expect(screen.getByText('DownloadSimple')).toBeInTheDocument();
    await render(<TxIcon transactionType={TxType.CONTRACTCALL} />);
    expect(screen.getByText('ArrowsLeftRight')).toBeInTheDocument();
    await render(<TxIcon transactionType={TxType.PREDICATE} />);
    expect(screen.getByText('MagicWand')).toBeInTheDocument();
  });
});
