import contractIds from './contract-ids.json';

export const MAIN_CONTRACT_ID = contractIds.MainContract;
export const EXTERNAL_CONTRACT_ID = contractIds.ExternalContract;
export const IS_TEST = import.meta.env.MODE === 'test';
