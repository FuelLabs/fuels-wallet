import contractIdsDevnet from './contract-ids.devnet.json';
import contractIds from './contract-ids.json';
import contractIdsTestnet from './contract-ids.testnet.json';

const FUEL_PROVIDER_URL = import.meta.env.VITE_FUEL_PROVIDER_URL;

let contractsIdsToUse: Record<string, string> | undefined;

if (FUEL_PROVIDER_URL?.indexOf('testnet') !== -1) {
  contractsIdsToUse = contractIdsTestnet;
} else if (FUEL_PROVIDER_URL?.indexOf('devnet') !== -1) {
  contractsIdsToUse = contractIdsDevnet;
} else {
  contractsIdsToUse = contractIds;
}

export const MAIN_CONTRACT_ID = contractsIdsToUse.MainContract;
export const EXTERNAL_CONTRACT_ID = contractsIdsToUse.ExternalContract;
