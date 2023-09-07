import type { JsonAbi } from 'fuels';

export type AbiMap = {
  [key: string]: JsonAbi;
};

export type AbiTable = {
  contractId: string;
  abi: JsonAbi;
};
