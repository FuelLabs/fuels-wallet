import contractIds from '../../src/contract-ids.json';
import contractIdsTestnet from '../../src/contract-ids.testnet.json';

const { VITE_FUEL_PROVIDER_URL } = process.env;

const constracsIdsToUse =
  VITE_FUEL_PROVIDER_URL?.indexOf('testnet') !== -1
    ? contractIdsTestnet
    : contractIds;

export const MAIN_CONTRACT_ID = constracsIdsToUse.MainContract;
export const EXTERNAL_CONTRACT_ID = constracsIdsToUse.ExternalContract;
