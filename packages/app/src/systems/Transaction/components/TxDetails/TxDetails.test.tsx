/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  fireEvent,
  render,
  screen,
  testA11y,
  waitFor,
} from '@fuel-ui/test-utils';
import { bn } from 'fuels';

import { MOCK_TX } from '../../__mocks__/transaction';

import { TxDetails } from './TxDetails';

import { MAX_FRACTION_DIGITS } from '~/config';

describe('TxDetails', () => {
  it('a11y', async () => {
    await testA11y(<TxDetails receipts={MOCK_TX.receipts} />);
  });

  it('should be able to show the transaction gas used', async () => {
    render(<TxDetails receipts={MOCK_TX.receipts} />);
    expect(() => screen.getByText(/Gas used/i)).toThrow();
    const btn = screen.getByText(/Transaction Details/i);
    fireEvent.click(btn);

    await waitFor(() => {
      expect(screen.getByText(/Gas used/i)).toBeInTheDocument();
      const val = screen.getByLabelText(/Gas value/i);
      expect(val).toBeInTheDocument();
      const gasUsed = (MOCK_TX.receipts[3] as any).gasUsed;
      expect(val.innerHTML.trim()).toBe(
        `${bn(gasUsed).formatUnits(MAX_FRACTION_DIGITS)} ETH`
      );
    });
  });
});
