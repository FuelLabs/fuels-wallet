import { Address, bn, BaseAssetId, Provider, Wallet } from 'fuels';
import { TxService } from '~/systems/Transaction/services';

export const getMockedTransaction = async (
  owner: string,
  destiny: string,
  providerUrl: string
) => {
  const destinyAddress = Address.fromPublicKey(destiny);
  const provider = await Provider.create(providerUrl);
  const ownerWallet = Wallet.fromAddress(
    Address.fromPublicKey(owner),
    provider
  );
  const transactionRequest = await TxService.createTransfer({
    to: destinyAddress.toString(),
    amount: bn.parseUnits('0.1'),
    assetId: BaseAssetId,
    provider: ownerWallet.provider,
  });

  return TxService.fundTransaction({
    wallet: ownerWallet,
    transactionRequest,
  });
};
