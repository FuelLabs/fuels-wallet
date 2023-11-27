import type { WalletUnlocked } from 'fuels';
import {
  bn,
  ScriptTransactionRequest,
  Wallet,
  Provider,
  TransactionType,
} from 'fuels';
import { VITE_FUEL_PROVIDER_URL } from '~/config';

import { TxService } from './transaction';

const OWNER = import.meta.env.VITE_ADDR_OWNER;
const amount = bn(1);
const params = { gasLimit: bn(100000), gasPrice: bn(100000) };

describe('TxService', () => {
  let wallet: WalletUnlocked;
  let transactionRequest: ScriptTransactionRequest;

  beforeAll(async () => {
    const provider = await Provider.create(VITE_FUEL_PROVIDER_URL);
    wallet = Wallet.fromPrivateKey(OWNER, provider);
    const coins = await wallet.getCoins();
    const newAddr = Wallet.generate({
      provider,
    }).address;
    transactionRequest = new ScriptTransactionRequest(params);
    const assetId = coins[0].assetId;
    transactionRequest.addCoinOutput(newAddr, amount, assetId);
    const { maxFee, requiredQuantities } =
      await provider.getTransactionCost(transactionRequest);
    await wallet.fund(transactionRequest, requiredQuantities, maxFee);
  });

  beforeEach(async () => {
    await TxService.clear();
  });

  it('should add a new tx on database', async () => {
    let txs = await TxService.getAll();
    expect(txs.length).toBe(0);
    await TxService.add({
      data: transactionRequest,
      type: TransactionType.Script,
    });
    txs = await TxService.getAll();
    expect(txs.length).toBe(1);
  });

  it('should remove a new tx on database', async () => {
    const txs = await TxService.getAll();
    expect(txs.length).toBe(0);
    const tx = await TxService.add({
      data: transactionRequest,
      type: TransactionType.Script,
    });
    if (tx) {
      await TxService.remove({ id: tx.id! });
      expect(txs.length).toBe(0);
    }
  });
});
