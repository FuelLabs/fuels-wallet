import {
  fireEvent,
  render,
  screen,
  testA11y,
  waitFor,
} from '@fuel-ui/test-utils';
import { bn, DECIMAL_UNITS } from 'fuels';

import { MOCK_OUTPUT_AMOUNT } from '../../__mocks__/transaction';

import { TxDetails } from './TxDetails';

describe('TxDetails', () => {
  it('a11y', async () => {
    await testA11y(<TxDetails fee={bn(6)} />);
  });

  it('a11y Loader', async () => {
    await testA11y(<TxDetails.Loader />);
  });

  it('should be able to show the transaction gas used', async () => {
    const feeCost = bn(6);
    render(<TxDetails fee={feeCost} amountSent={MOCK_OUTPUT_AMOUNT} />);
    expect(() => screen.getByText(/Fee \(network\)/i)).toThrow();
    const btn = screen.getByText(/Transaction Details/i);
    fireEvent.click(btn);

    await waitFor(() => {
      expect(screen.getByText(/Fee \(network\)/i)).toBeInTheDocument();
      const valGas = screen.getByLabelText(/Gas value/i);
      expect(valGas).toBeInTheDocument();
      const valTotal = screen.getByLabelText(/Total value/i);
      expect(valTotal).toBeInTheDocument();
      expect(valGas.innerHTML.trim()).toBe(
        `${feeCost.format({ precision: DECIMAL_UNITS })} ETH`
      );
      expect(valTotal.innerHTML.trim()).toBe(
        `${feeCost
          .add(MOCK_OUTPUT_AMOUNT)
          .format({ precision: DECIMAL_UNITS })} ETH`
      );
    });
  });
});
