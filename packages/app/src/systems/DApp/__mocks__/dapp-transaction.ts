import { Address, bn, BaseAssetId, Provider, Wallet } from 'fuels';
import { TxService } from '~/systems/Transaction/services';

function getAddressFromString(address: string) {
  return address.length > 66
    ? Address.fromPublicKey(address)
    : Address.fromString(address);
}

export const getMockedTransaction = async (
  owner: string,
  destiny: string,
  providerUrl: string
) => {
  const ownerAddress = getAddressFromString(owner);
  const destinyAddress = getAddressFromString(destiny);
  const provider = await Provider.create(providerUrl);
  const ownerWallet = Wallet.fromAddress(ownerAddress, provider);
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
