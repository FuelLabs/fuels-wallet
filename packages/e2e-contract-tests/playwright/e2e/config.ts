import contractIds from '../../src/contract-ids.json';
import contractIdsTestnet from '../../src/contract-ids.testnet.json';

const { VITE_FUEL_PROVIDER_URL } = process.env;

let contractsIdsToUse: Record<string, string> | undefined;

if (VITE_FUEL_PROVIDER_URL?.indexOf('testnet') !== -1) {
  contractsIdsToUse = contractIdsTestnet;
} else {
  contractsIdsToUse = contractIds;
}

export const MAIN_CONTRACT_ID = contractsIdsToUse.MainContract;
export const EXTERNAL_CONTRACT_ID = contractsIdsToUse.ExternalContract;
