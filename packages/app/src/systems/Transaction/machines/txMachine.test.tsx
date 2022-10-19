import { bn, ScriptTransactionRequest, Wallet } from 'fuels';
import { interpret } from 'xstate';
import { waitFor } from 'xstate/lib/waitFor';

import { TxService } from '../services';
import type { Transaction } from '../types';
import { TxType } from '../types';

import { txMachine } from './txMachine';

import { VITE_FUEL_PROVIDER_URL } from '~/config';

const OWNER = import.meta.env.VITE_ADDR_OWNER;
const amount = bn(1);
const params = { gasLimit: bn(100000), gasPrice: bn(100000) };

describe('txMachine', () => {
  let wallet: Wallet;
  let txRequest: ScriptTransactionRequest;
  let tx: Transaction | undefined;

  beforeAll(async () => {
    wallet = new Wallet(OWNER, VITE_FUEL_PROVIDER_URL);
    const coins = await wallet.getCoins();
    const newAddr = Wallet.generate({
      provider: VITE_FUEL_PROVIDER_URL,
    }).address;
    const assetId = coins[0].assetId;
    txRequest = new ScriptTransactionRequest(params);
    txRequest.addCoinOutput(newAddr, amount, assetId);
    txRequest.addCoins(
      await wallet.getCoinsToSpend([
        [amount, assetId],
        txRequest.calculateFee(),
      ])
    );
  });

  beforeEach(async () => {
    await TxService.clear();
    tx = await TxService.add({
      data: txRequest,
      type: TxType.request,
    });
  });

  async function initService(tx: Transaction) {
    const service = interpret(txMachine.withContext({})).start();
    service.send('GET_TRANSACTION', { input: { wallet, id: tx.id } });
    await waitFor(service, (state) => state.matches('fetching'));
    await waitFor(service, (state) => state.matches('idle'));
    return service;
  }

  it('should simulate a transaction when type is request', async () => {
    if (!tx) return;
    const service = await initService(tx);
    const state = service.getSnapshot();
    expect(state.context.simulateResult).toBeDefined();
    expect(state.context.wallet).toBeDefined();
  });

  it('should approve and send a transaction', async () => {
    if (!tx) return;
    let txs = await TxService.getAll();
    expect(txs.length).toBe(1);
    const service = await initService(tx);
    service.send({ type: 'APPROVE' });
    await waitFor(service, (state) => state.matches('sent'));

    txs = await TxService.getAll();
    const state = service.getSnapshot();
    expect(state.context.txResponse).toBeDefined();
    expect(txs.length).toBe(1);
    expect(txs[0].type).toBe(TxType.response);
  });
});
