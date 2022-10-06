import type { AddressType } from '../Account';

export enum TxState {
  default,
  success,
  pending,
  failed,
}

export type TxRecipientAddress = {
  address: string;
  type: AddressType;
};
