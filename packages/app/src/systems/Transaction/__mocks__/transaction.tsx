import { bn, TransactionType } from 'fuels';

import type { Transaction } from '../types';
import { TxStatus } from '../types';

export const MOCK_TX = {
  status: {
    type: 'success',
    programState: {
      returnType: 'RETURN_DATA',
      data: '0xa65838dfa14be9253c6136f57aba2981a118d08ea4177eccbc14705878c2ebfb',
    },
  },
  receipts: [
    {
      type: 0,
      from: '0x0000000000000000000000000000000000000000000000000000000000000000',
      to: '0x73068c73b318292b426251138bc21d0d5700585653d041a42ed4099fa0d0f22d',
      amount: bn('50000000'),
      assetId:
        '0x0000000000000000000000000000000000000000000000000000000000000000',
      gas: bn('840470'),
      param1: bn('1536698254'),
      param2: bn('14440'),
      pc: bn('17376'),
      is: bn('17376'),
    },
    {
      type: 1,
      id: '0x73068c73b318292b426251138bc21d0d5700585653d041a42ed4099fa0d0f22d',
      val: bn('59721250148'),
      pc: bn('101868'),
      is: bn('17376'),
    },
    {
      type: 2,
      id: '0x0000000000000000000000000000000000000000000000000000000000000000',
      ptr: bn('8388288'),
      len: bn('160'),
      digest:
        '0xa65838dfa14be9253c6136f57aba2981a118d08ea4177eccbc14705878c2ebfb',
      pc: bn('160'),
      is: bn('1'),
      data: '0x0000000000000001000000000000000000000000000000000000000de7a9f564000000000000000000000000000030b80000000000003b480000000000004188000000000000000000000000007fff5f000000000000000000000000000cd2a200000000000000000000000000000000000000000000286800000000000000000000000000000000000000000000000000000000000cd3160000000000003ca0',
    },
    {
      type: 9,
      result: bn('0'),
      gasUsed: bn('667318'),
    },
  ],
  transactionId:
    '0x3ebd41c1c82fe31c3f74ad175d58552b29363f9a5ee7e26301b4a9cf0eaf6972',
  blockId: '0xffef250db6a72a00b03fbe91459bf4ce087de9883f6510414399d5441994b62b',
  time: '2022-10-05T00:51:22.383161296+00:00',
};

export const MOCK_OUTPUT_AMOUNT = bn.parseUnits('0.5');

export const MOCK_TRANSACTION: Transaction = {
  id: '12132213231231',
  type: TransactionType.Script,
  status: TxStatus.pending,
  data: undefined,
};
