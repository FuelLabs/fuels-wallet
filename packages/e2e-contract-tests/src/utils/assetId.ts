import { Address, Provider, hash } from 'fuels';

export const calculateAssetId = (contractId: string, subId: string) => {
  const contractIdBytes = new Address(contractId).toBytes();
  const subIdBytes = new Address(subId).toBytes();
  const bytesToHash = Uint8Array.from([...contractIdBytes, ...subIdBytes]);
  const assetId = hash(bytesToHash);
  return assetId;
};

export const getBaseAssetId = async () => {
  const provider = new Provider(process.env.VITE_FUEL_PROVIDER_URL!);
  return await provider.getBaseAssetId();
};
