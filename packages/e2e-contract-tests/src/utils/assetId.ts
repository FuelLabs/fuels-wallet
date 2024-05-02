import { Address, Provider, hash } from 'fuels';

let baseAssetId: string;
Provider.create(process.env.FUEL_PROVIDER_URL!).then((provider) => {
  baseAssetId = provider.getBaseAssetId();
});

export const calculateAssetId = (
  contractId: string,
  subId: string = baseAssetId
) => {
  const contractIdBytes = Address.fromAddressOrString(contractId).toBytes();
  const subIdBytes = Address.fromAddressOrString(subId).toBytes();
  const bytesToHash = Uint8Array.from([...contractIdBytes, ...subIdBytes]);
  const assetId = hash(bytesToHash);
  return assetId;
};

export const getBaseAssetId = () => {
  console.error('fsk data', process.env.FUEL_PROVIDER_URL, baseAssetId);
  return baseAssetId;
};
