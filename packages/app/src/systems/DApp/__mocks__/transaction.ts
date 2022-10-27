import {
  Address,
  bn,
  hexlify,
  MAX_GAS_PER_TX,
  ScriptTransactionRequest,
} from 'fuels';
import type { CoinQuantityLike, Provider } from 'fuels';

export const getMockedTransaction = async (
  owner: string,
  destiny: string,
  provider: Provider
) => {
  const params = { gasLimit: MAX_GAS_PER_TX, gasPrice: 1 };
  const txRequest = new ScriptTransactionRequest(params);
  const destinyAddress = Address.fromPublicKey(destiny);
  const ownerAddress = Address.fromPublicKey(owner);
  const assetId =
    '0x0000000000000000000000000000000000000000000000000000000000000000';
  const amount = bn.parseUnits('0.1').toNumber();
  txRequest.addCoinOutput(destinyAddress, amount, assetId);
  const fee = txRequest.calculateFee();
  let quantities: CoinQuantityLike[] = [];
  if (fee.assetId === hexlify(assetId)) {
    fee.amount.add(amount);
    quantities = [fee];
  } else {
    quantities = [[amount, assetId], fee];
  }

  const coins = await provider.getCoinsToSpend(ownerAddress, quantities);
  txRequest.addCoins(coins);

  return txRequest;
};
