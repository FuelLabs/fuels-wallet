import { render, screen, testA11y } from '@fuel-ui/test-utils';
import { bn } from 'fuels';

import { MOCK_OUTPUT_AMOUNT } from '../../__mocks__/transaction';

import { TxDetails } from './TxDetails';

describe('TxDetails', () => {
  it('a11y', async () => {
    await testA11y(<TxDetails fee={bn(6)} />);
  });

  it('should be able to show the transaction gas used', async () => {
    const feeCost = bn(6);
    render(<TxDetails fee={feeCost} amountSent={MOCK_OUTPUT_AMOUNT} />);
    expect(await screen.findByText(/fee \(network\)/i)).toBeInTheDocument();
    const valGas = screen.getByLabelText(/Gas value/i);
    expect(valGas).toBeInTheDocument();
    const valTotal = screen.getByLabelText(/Total value/i);
    expect(valTotal).toBeInTheDocument();
    expect(valGas.innerHTML.trim()).toBe(`${feeCost.format()} ETH`);
    expect(valTotal.innerHTML.trim()).toBe(
      `${feeCost.add(MOCK_OUTPUT_AMOUNT).format()} ETH`
    );
  });
});
