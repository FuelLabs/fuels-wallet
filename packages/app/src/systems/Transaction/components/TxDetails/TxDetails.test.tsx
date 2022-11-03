/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  fireEvent,
  render,
  screen,
  testA11y,
  waitFor,
} from '@fuel-ui/test-utils';
import { bn } from 'fuels';

import { MOCK_OUTPUT_AMOUNT, MOCK_TX } from '../../__mocks__/transaction';

import { TxDetails } from './TxDetails';

describe('TxDetails', () => {
  it('a11y', async () => {
    await testA11y(<TxDetails receipts={MOCK_TX.receipts} />);
  });

  it('should be able to show the transaction gas used', async () => {
    render(
      <TxDetails
        receipts={MOCK_TX.receipts}
        outputAmount={MOCK_OUTPUT_AMOUNT}
      />
    );
    expect(() => screen.getByText(/Fee \(network\)/i)).toThrow();
    const btn = screen.getByText(/Transaction Details/i);
    fireEvent.click(btn);

    await waitFor(() => {
      expect(screen.getByText(/Fee \(network\)/i)).toBeInTheDocument();
      const valGas = screen.getByLabelText(/Gas value/i);
      expect(valGas).toBeInTheDocument();
      const valTotal = screen.getByLabelText(/Total value/i);
      expect(valTotal).toBeInTheDocument();
      const gasUsed = (MOCK_TX.receipts[3] as any).gasUsed;
      expect(valGas.innerHTML.trim()).toBe(`${bn(gasUsed).format()} ETH`);
      expect(valTotal.innerHTML.trim()).toBe(
        `${bn(gasUsed).add(MOCK_OUTPUT_AMOUNT).format()} ETH`
      );
    });
  });
});
