import { render, screen, testA11y } from '@fuel-ui/test-utils';

import { OperationName } from '../../utils';

import { TxIcon } from './TxIcon';

describe('TxIcon', () => {
  it('a11y', async () => {
    await testA11y(<TxIcon operationName={OperationName.contractCall} />);
  });

  it('should render icon correctly', async () => {
    await render(<TxIcon operationName={OperationName.receive} />);
    expect(screen.getByText('DownloadSimple')).toBeInTheDocument();
    await render(<TxIcon operationName={OperationName.contractCall} />);
    expect(screen.getByText('ArrowsLeftRight')).toBeInTheDocument();
    await render(<TxIcon operationName={OperationName.predicatecall} />);
    expect(screen.getByText('MagicWand')).toBeInTheDocument();
  });
});
