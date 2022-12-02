import type { WalletUnlocked } from 'fuels';
import { TransactionType, bn, ScriptTransactionRequest, Wallet } from 'fuels';

import { TxService } from './transaction';

import { VITE_FUEL_PROVIDER_URL } from '~/config';

const OWNER = import.meta.env.VITE_ADDR_OWNER;
const amount = bn(1);
const params = { gasLimit: bn(100000), gasPrice: bn(100000) };

describe('TxService', () => {
  let wallet: WalletUnlocked;
  let txRequest: ScriptTransactionRequest;

  beforeAll(async () => {
    wallet = Wallet.fromPrivateKey(OWNER, VITE_FUEL_PROVIDER_URL);
    const coins = await wallet.getCoins();
    const newAddr = Wallet.generate({
      provider: VITE_FUEL_PROVIDER_URL,
    }).address;
    txRequest = new ScriptTransactionRequest(params);
    const assetId = coins[0].assetId;
    txRequest.addCoinOutput(newAddr, amount, assetId);
    wallet.fund(txRequest);
  });

  beforeEach(async () => {
    await TxService.clear();
  });

  it('should add a new tx on database', async () => {
    let txs = await TxService.getAll();
    expect(txs.length).toBe(0);
    await TxService.add({ data: txRequest, type: TransactionType.Script });
    txs = await TxService.getAll();
    expect(txs.length).toBe(1);
  });

  it('should remove a new tx on database', async () => {
    const txs = await TxService.getAll();
    expect(txs.length).toBe(0);
    const tx = await TxService.add({
      data: txRequest,
      type: TransactionType.Script,
    });
    if (tx) {
      await TxService.remove({ id: tx.id! });
      expect(txs.length).toBe(0);
    }
  });
});
