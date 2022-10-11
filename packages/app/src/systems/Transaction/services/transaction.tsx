import type { Wallet } from 'fuels';

import type { TxRequest } from '../types';

export type TxInputs = {
  simulate: {
    wallet: Wallet;
    tx: TxRequest;
  };
};

export class TxService {
  static async simulate(input: TxInputs['simulate']) {
    return input.wallet.simulateTransaction(input.tx);
  }
}
