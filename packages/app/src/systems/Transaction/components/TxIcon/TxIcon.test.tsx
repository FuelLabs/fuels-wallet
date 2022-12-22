import { render, screen, testA11y } from '@fuel-ui/test-utils';

import { TxCategory } from '../../types';

import { TxIcon } from './TxIcon';

describe('TxIcon', () => {
  it('a11y', async () => {
    await testA11y(<TxIcon transactionType={TxCategory.RECEIVE} />);
  });

  it('should render icon correctly', async () => {
    await render(<TxIcon transactionType={TxCategory.RECEIVE} />);
    expect(screen.getByText('DownloadSimple')).toBeInTheDocument();
    await render(<TxIcon transactionType={TxCategory.CONTRACTCALL} />);
    expect(screen.getByText('ArrowsLeftRight')).toBeInTheDocument();
    await render(<TxIcon transactionType={TxCategory.PREDICATE} />);
    expect(screen.getByText('MagicWand')).toBeInTheDocument();
  });
});
