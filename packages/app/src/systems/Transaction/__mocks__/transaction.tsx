import {
  SimplifiedTransactionStatusNameEnum,
  TransactionTypeNameEnum,
  bn,
} from 'fuels';

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

export const MOCK_TRANSACTION_SCRIPT = {
  id: '12132213231231',
  type: TransactionTypeNameEnum.Script,
  status: SimplifiedTransactionStatusNameEnum.submitted,
  data: undefined,
};

export const MOCK_TRANSACTION_CREATE = {
  id: '12132213231231',
  type: TransactionTypeNameEnum.Create,
  status: SimplifiedTransactionStatusNameEnum.submitted,
  data: undefined,
};

export const MOCK_TRANSACTION_WITH_RECEIPTS_GQL = {
  // this response is got from a simple "Send" transaction created from the wallet UI.
  transaction: {
    id: '0x64641e1faeb1b0052d95e055b085b45b85155a7ec8cc47b1c6b7ed9f2783837a',
    rawPayload:
      '0x000000000000000000000000000000010000000000989680000000000000000000000000000000040000000000000000000000000000000100000000000000020000000000000001e882ddcadd1d5075e97b141548f87c47a550dbd7f582083a7211463edc3acccf2400000000000000000000000000000002a7b90ac5ec741778a145da8db4fb5d677bcec8c8735c25268060834d459a53000000000000000157c23aefdbb5941d3abc454d702c4e54d1ab4c853643480f14f4405ad9b228370000000011e1a2d7000000000000000000000000000000000000000000000000000000000000000000000000000045d400000000000000010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000007b46e795e0b80d9d5d1ab578e20ba48f195a657b7e4a28d7dab97e584d959b740000000005f5e1000000000000000000000000000000000000000000000000000000000000000000000000000000000257c23aefdbb5941d3abc454d702c4e54d1ab4c853643480f14f4405ad9b22837000000000bebc1c20000000000000000000000000000000000000000000000000000000000000000000000000000004092c7c702892d22482e96d086766f57e91c675d4c868f3a0fda418e4ab3e4978aa8ccd51f65542b6407a2b7f4af49bc127d50899bab02b7e5bce8adc0091ad060',
    gasPrice: '1',
    receipts: [
      {
        contract: null,
        pc: '10344',
        is: '10344',
        to: null,
        toAddress: null,
        amount: null,
        assetId: null,
        gas: null,
        param1: null,
        param2: null,
        val: '0',
        ptr: null,
        digest: null,
        reason: null,
        ra: null,
        rb: null,
        rc: null,
        rd: null,
        len: null,
        receiptType: 'RETURN',
        result: null,
        gasUsed: null,
        data: null,
        sender: null,
        recipient: null,
        nonce: null,
        contractId: null,
        subId: null,
      },
      {
        contract: null,
        pc: null,
        is: null,
        to: null,
        toAddress: null,
        amount: null,
        assetId: null,
        gas: null,
        param1: null,
        param2: null,
        val: null,
        ptr: null,
        digest: null,
        reason: null,
        ra: null,
        rb: null,
        rc: null,
        rd: null,
        len: null,
        receiptType: 'SCRIPT_RESULT',
        result: '0',
        gasUsed: '13',
        data: null,
        sender: null,
        recipient: null,
        nonce: null,
        contractId: null,
        subId: null,
      },
    ],
    status: {
      type: 'SuccessStatus',
      block: {
        id: '0xe0710c561735660032fc94db9535b39e523ceba91ae33c3a77f9532d9e30ca05',
      },
      time: '4611686020119787600',
      programState: {
        returnType: 'RETURN',
        data: '0x0000000000000000',
      },
    },
  },
  chain: {
    consensusParameters: {
      gasPerByte: '4',
      gasPriceFactor: '92',
    },
  },
};
