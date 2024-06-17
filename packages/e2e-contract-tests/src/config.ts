import contractIdsDevnet from './contract-ids.devnet.json';
import contractIds from './contract-ids.json';
import contractIdsTestnet from './contract-ids.testnet.json';

const FUEL_PROVIDER_URL = import.meta.env.VITE_FUEL_PROVIDER_URL;

// biome-ignore lint/suspicious/noImplicitAnyLet: <explanation>
let constracsIdsToUse;

if (FUEL_PROVIDER_URL?.indexOf('testnet') !== -1) {
  constracsIdsToUse = contractIdsTestnet;
} else if (FUEL_PROVIDER_URL?.indexOf('devnet') !== -1) {
  constracsIdsToUse = contractIdsDevnet;
} else {
  constracsIdsToUse = contractIds;
}

export const MAIN_CONTRACT_ID = constracsIdsToUse.MainContract;
export const EXTERNAL_CONTRACT_ID = constracsIdsToUse.ExternalContract;
