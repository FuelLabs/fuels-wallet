import { Address, bn, BaseAssetId, Provider, Wallet } from 'fuels';

import { TxService } from '~/systems/Transaction/services';

export const getMockedTransaction = async (
  owner: string,
  destiny: string,
  providerUrl: string
) => {
  const destinyAddress = Address.fromPublicKey(destiny);
  const ownerWallet = Wallet.fromAddress(Address.fromPublicKey(owner));
  ownerWallet.provider = new Provider(providerUrl);
  const transactionRequest = await TxService.createTransfer({
    to: destinyAddress.toString(),
    amount: bn.parseUnits('0.1'),
    assetId: BaseAssetId,
  });

  return TxService.fundTransaction({
    wallet: ownerWallet,
    transactionRequest,
  });
};
