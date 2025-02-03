import { render, screen, testA11y } from '@fuel-ui/test-utils';
import { bn } from 'fuels';

import { TxFee } from './TxFee';

describe('TxFee', () => {
  it('should be able to show the transaction fee', async () => {
    const feeCost = bn(6);
    render(<TxFee fee={feeCost} />);
    expect(await screen.findByText(/fee \(network\)/i)).toBeInTheDocument();
    const valFee = screen.getByLabelText(/Fee value/i);
    expect(valFee).toBeInTheDocument();
    expect(valFee.innerHTML.trim()).toBe(`(${feeCost.format()} ETH)`);

    const valFeeUsd = screen.getByLabelText(/tip in usd/i);
    expect(valFeeUsd).toBeInTheDocument();
    expect(valFeeUsd.innerHTML.trim()).toBe('$0.01');
  });
});
