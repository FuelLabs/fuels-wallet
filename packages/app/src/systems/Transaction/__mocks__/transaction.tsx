import { TransactionStatus, TransactionTypeName } from 'fuels';
import { MOCK_CHAIN_INFO } from '~/systems/Network/__mocks__/chainInfo';

export const MOCK_TRANSACTION_SCRIPT = {
  id: '12132213231231',
  type: TransactionTypeName.Script,
  status: TransactionStatus.submitted,
  data: undefined,
};

export const MOCK_TRANSACTION_CREATE = {
  id: '12132213231231',
  type: TransactionTypeName.Create,
  status: TransactionStatus.submitted,
  data: undefined,
};

export const MOCK_TRANSACTION_WITH_RECEIPTS_GQL = {
  // this response is got from a simple "Send" transaction created from the wallet UI.
  transaction: {
    id: '0xaeb72ff8937553828b5cd9f05efa5a6e1bb21f628cd90f4c91101799d27d5ddb',
    rawPayload:
      '0x000000000000000000000000000002ddc27a4ce0f152478cf32027140179d8a65aa85bae900a0054c5afdeb69503c4f000000000000000040000000000000000000000000000000800000000000000010000000000000002000000000000000124000000000000000000000000000371000000000000000054d0cebcdcff05b42e7ecb8a702922e383a7654004a660730ff2aceb9ff580b00000000000000000bbe95b34554ff07244f32234f95e56d7695c4e987e150eb1878cf9e70648aedd00000000186fffaa0000000000000000000000000000000000000000000000000000000000000000000000000000000e000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000613f61758566fbd145f3f834156f2c4249038565fdc2cfccec191adcb77b6fa700000000000186a000000000000000000000000000000000000000000000000000000000000000000000000000000002bbe95b34554ff07244f32234f95e56d7695c4e987e150eb1878cf9e70648aedd00000000186e759900000000000000000000000000000000000000000000000000000000000000000000000000000040334daf700179a760105112805dc5c0ac909cc63f8afdc5aaff2cf7bd84c8f81232ba3023501c9eb67645b64cf5bee19873e26fec63e6e8e507a80330ff420bef',
    status: {
      type: 'SuccessStatus',
      block: {
        id: '0x4ed161f29c72b986a534cba8d48586d2d69f3ae7289bb5a14792173570baa1ba',
      },
      time: '4611686020142520776',
      programState: {
        returnType: 'RETURN',
        data: '0x0000000000000000',
      },
      receipts: [
        {
          id: null,
          pc: '10368',
          is: '10368',
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
          id: null,
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
          gasUsed: '733',
          data: null,
          sender: null,
          recipient: null,
          nonce: null,
          contractId: null,
          subId: null,
        },
      ],
      totalGas: '81050',
      totalFee: '881',
    },
  },
  chain: MOCK_CHAIN_INFO.chain,
  nodeInfo: {
    utxoValidation: true,
    vmBacktrace: true,
    maxTx: '4064',
    maxDepth: '10',
    nodeVersion: '0.26.0',
  },
  latestGasPrice: {
    gasPrice: '1',
  },
  balances: {
    edges: [
      {
        node: {
          owner:
            '0xbbe95b34554ff07244f32234f95e56d7695c4e987e150eb1878cf9e70648aedd',
          amount: '499985267',
          assetId:
            '0x0000000000000000000000000000000000000000000000000000000000000000',
        },
      },
    ],
  },
};
