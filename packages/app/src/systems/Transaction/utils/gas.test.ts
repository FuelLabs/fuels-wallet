/* eslint-disable @typescript-eslint/no-explicit-any */
import { bn } from 'fuels';

import { getGasUsedFromTx } from './gas';

const TX = {
  receipts: [
    { gasUsed: bn(10000000) },
    { gasUsed: bn(10000000) },
    { gasUsed: bn(10000000) },
  ],
} as any;

describe('gas()', () => {
  describe('getGasUsedFromTx()', () => {
    it('should sum all gas used inside receipts', async () => {
      expect(getGasUsedFromTx(TX).toString()).toBe(bn(30000000).toString());
    });
  });
});
