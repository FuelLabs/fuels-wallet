/* eslint-disable @typescript-eslint/no-explicit-any */
import type { TransactionResult } from 'fuels';

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

export type Transaction = TransactionResult<any>;
