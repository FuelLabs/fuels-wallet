import { AddressType } from '@fuel-wallet/types';
import { bn, TransactionType } from 'fuels';

import { TxCategory } from '~/systems/Transaction/types';
import { TxStatus } from '~/systems/Transaction/utils';

export const MOCK_TRANSACTION = {
  id: '0xc019789a1d43f6ed799bcd4abf6b5a69ce91e60710e3bc6ab3b2ca0996cdef4d',
  type: TransactionType.Script,
  from: {
    address: '0x0000000000000000000000000000000000000000',
    type: AddressType.contract,
  },
  to: {
    address: '0x0000000000000000000000000000000000000000',
    type: AddressType.contract,
  },
  amount: {
    assetId: '',
    imageUrl: '',
    name: 'ETH',
    symbol: 'ETH',
    amount: bn('5000000'),
  },
  category: TxCategory.SCRIPT,
  status: TxStatus.success,
};

export const MOCK_TRANSACTION_CREATE = {
  id: '0xc019789a1d43f6ed799bcd4abf6b5a69ce91e60710e3bc6ab3b2ca0996cdef4d',
  type: TransactionType.Create,
  from: {
    address: '0x0000000000000000000000000000000000000000',
    type: AddressType.contract,
  },
  to: {
    address: '0x0000000000000000000000000000000000000000',
    type: AddressType.contract,
  },
  amount: {
    assetId: '',
    imageUrl: '',
    name: 'ETH',
    symbol: 'ETH',
    amount: bn('5000000'),
  },
  category: TxCategory.CONTRACTCALL,
  status: TxStatus.success,
};
