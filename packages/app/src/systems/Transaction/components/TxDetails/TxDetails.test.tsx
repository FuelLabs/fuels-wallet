import { render, screen, testA11y } from '@fuel-ui/test-utils';
import { bn } from 'fuels';

import { TxDetails } from './TxDetails';

describe('TxDetails', () => {
  it('a11y', async () => {
    await testA11y(<TxDetails fee={bn(6)} />);
  });

  it('should be able to show the transaction fee', async () => {
    const feeCost = bn(6);
    render(<TxDetails fee={feeCost} />);
    expect(await screen.findByText(/fee \(network\)/i)).toBeInTheDocument();
    const valFee = screen.getByLabelText(/Fee value/i);
    expect(valFee).toBeInTheDocument();
    expect(valFee.innerHTML.trim()).toBe(`${feeCost.format()} ETH`);
  });
});
