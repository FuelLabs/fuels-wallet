import type { JsonFlatAbi } from 'fuels';

export type AbiMap = {
  [key: string]: JsonFlatAbi;
};

export type AbiTable = {
  contractId: string;
  abi: JsonFlatAbi;
};
