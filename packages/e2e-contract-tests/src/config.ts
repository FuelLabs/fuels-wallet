import contractIds from './contract-ids.json';
import contractIdsTestnet from './contract-ids.testnet.json';

const FUEL_PROVIDER_URL = import.meta.env.VITE_FUEL_PROVIDER_URL;

const constracsIdsToUse =
  FUEL_PROVIDER_URL?.indexOf('testnet') !== -1
    ? contractIdsTestnet
    : contractIds;

export const MAIN_CONTRACT_ID = constracsIdsToUse.MainContract;
export const EXTERNAL_CONTRACT_ID = constracsIdsToUse.ExternalContract;
export const IS_TEST = import.meta.env.MODE === 'test';
