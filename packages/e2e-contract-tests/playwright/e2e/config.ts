import contractIdsDevnet from '../../src/contract-ids.devnet.json';
import contractIds from '../../src/contract-ids.json';
import contractIdsTestnet from '../../src/contract-ids.testnet.json';

const { VITE_FUEL_PROVIDER_URL } = process.env;

let contractsIdsToUse: Record<string, string> | undefined;

if (VITE_FUEL_PROVIDER_URL?.indexOf('testnet') !== -1) {
  constracsIdsToUse = contractIdsTestnet;
} else if (VITE_FUEL_PROVIDER_URL?.indexOf('devnet') !== -1) {
  constracsIdsToUse = contractIdsDevnet;
} else {
  constracsIdsToUse = contractIds;
}

export const MAIN_CONTRACT_ID = constracsIdsToUse.MainContract;
export const EXTERNAL_CONTRACT_ID = constracsIdsToUse.ExternalContract;
