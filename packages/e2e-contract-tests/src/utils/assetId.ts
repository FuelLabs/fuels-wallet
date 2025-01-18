import { Address, Provider, hash } from 'fuels';

export const calculateAssetId = (contractId: string, subId: string) => {
  const contractIdBytes = Address.fromAddressOrString(contractId).toBytes();
  const subIdBytes = Address.fromAddressOrString(subId).toBytes();
  const bytesToHash = Uint8Array.from([...contractIdBytes, ...subIdBytes]);
  const assetId = hash(bytesToHash);
  return assetId;
};

export const getBaseAssetId = async () => {
  const provider = new Provider(process.env.VITE_FUEL_PROVIDER_URL!);
  return provider.getBaseAssetId();
};
