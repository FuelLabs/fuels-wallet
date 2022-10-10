/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  fireEvent,
  render,
  screen,
  testA11y,
  waitFor,
} from '@fuel-ui/test-utils';

import { MOCK_TX } from '../../__mocks__/transaction';

import { TxDetails } from './TxDetails';

import { formatUnits } from '~/systems/Core';

describe('TxDetails', () => {
  it('a11y', async () => {
    await testA11y(<TxDetails tx={MOCK_TX} />);
  });

  it('should be able to show the transaction gas used', async () => {
    render(<TxDetails tx={MOCK_TX} />);
    expect(() => screen.getByText(/Gas used/i)).toThrow();
    const btn = screen.getByText(/Transaction Details/i);
    fireEvent.click(btn);

    await waitFor(() => {
      expect(screen.getByText(/Gas used/i)).toBeInTheDocument();
      const val = screen.getByLabelText(/Gas value/i);
      expect(val).toBeInTheDocument();
      const gasUsed = (MOCK_TX.receipts[3] as any).gasUsed;
      expect(val.innerHTML.trim()).toBe(`${formatUnits(gasUsed)} ETH`);
    });
  });
});
