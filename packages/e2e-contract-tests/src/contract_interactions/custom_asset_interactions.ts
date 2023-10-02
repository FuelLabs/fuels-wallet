import { FuelWalletLocked } from '@fuel-wallet/sdk';
import { Address, BaseAssetId, BigNumberish, hash } from 'fuels';
import { MintCustomAssetAbi__factory } from '../contracts';
import { IdentityInput } from '../contracts/MintCustomAssetAbi';
//import { sha256 } from 'js-sha256';

const CONTRACT_ID =
  '0x47ac856ba5366f44b59238a21999ff97c147662a97a89d7716c5a4c9d6599402';

export const mint = async ({
  wallet,
  amount,
}: {
  wallet: FuelWalletLocked;
  amount: BigNumberish;
}) => {
  const contract = MintCustomAssetAbi__factory.connect(CONTRACT_ID, wallet);
  const recipient: IdentityInput = {
    Address: {
      value: wallet.address.toHexString(),
    },
  };
  await contract.functions
    .mint(recipient, BaseAssetId, amount)
    .txParams({ gasPrice: 1 })
    .call();
};

export const calculateAssetId = (
  contractId: string = CONTRACT_ID,
  subId: string = BaseAssetId
) => {
  const contractIdBytes = Address.fromAddressOrString(contractId).toBytes();
  const subIdBytes = Address.fromAddressOrString(subId).toBytes();
  const bytesToHash = Array.from(contractIdBytes).concat(
    Array.from(subIdBytes)
  );
  const assetId = hash(bytesToHash);
  return assetId;
};
