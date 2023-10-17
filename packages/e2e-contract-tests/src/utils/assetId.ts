import { BaseAssetId, Address, hash } from 'fuels';

export const calculateAssetId = (
  contractId: string,
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
