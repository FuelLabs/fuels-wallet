import { bn } from 'fuels';

import type { Tx } from '../utils';
import { OperationName, TxStatus, TxType } from '../utils';

export const MOCK_TRANSACTIONS_BY_OWNER = {
  data: {
    coins: {
      edges: [
        {
          node: {
            utxoId:
              '0x8f3e1c5b6bed5880748bbfcd534d61632c55c025dd20769a8bb4d8da8e69b96400',
            owner:
              '0x7b3ba517cbb646dc4e9c3ecd2d973be361bb48f408286f2fd05db62de2b36422',
            amount: '500000000',
            assetId:
              '0x0000000000000000000000000000000000000000000000000000000000000000',
            maturity: '0',
            status: 'UNSPENT',
            blockCreated: '1',
            __typename: 'Coin',
          },
          __typename: 'CoinEdge',
        },
      ],
      __typename: 'CoinConnection',
    },
    transactionsByOwner: {
      edges: [
        {
          node: {
            id: '0x8f3e1c5b6bed5880748bbfcd534d61632c55c025dd20769a8bb4d8da8e69b964',
            rawPayload:
              '0x0000000000000000000000000000000100000000000f4240000000000000000000000000000000040000000000000000000000000000000100000000000000020000000000000001dbf1d8eb8702537eb1c0b41057f9a9f672b34bbc13633937820abc7bed36b27f240400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000194ffcc53b892684acefaebc8a3d4a595e528a8cf664eeb3ef36f1020b0809d0dffffffffffffffff000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000007b3ba517cbb646dc4e9c3ecd2d973be361bb48f408286f2fd05db62de2b36422000000001dcd65000000000000000000000000000000000000000000000000000000000000000000000000000000000394ffcc53b892684acefaebc8a3d4a595e528a8cf664eeb3ef36f1020b0809d0dffffffffe2329afe00000000000000000000000000000000000000000000000000000000000000000000000000000040d9740e8e400734740c8bf68177043c14eb3970616760d2770e5bca347846e95bd7cc5511aeec2e3fe6ce92b0990780b1e9e24b054b5318790661bb15589681ca',
            gasPrice: '1',
            status: {
              type: 'SuccessStatus',
              block: {
                id: '0xa89cdecc118758816dfdc65c831a748d95b7d4048cbb729e6315f374c91b43fc',
                __typename: 'Block',
              },
              time: '4611686020099207033',
              programState: {
                returnType: 'RETURN',
                data: '0x0000000000000001',
                __typename: 'ProgramState',
              },
              __typename: 'SuccessStatus',
            },
            __typename: 'Transaction',
            receipts: [
              {
                data: null,
                rawPayload:
                  '0x00000000000000010000000000000000000000000000000000000000000000000000000000000000000000000000000100000000000028680000000000002868',
                __typename: 'Receipt',
              },
              {
                data: null,
                rawPayload:
                  '0x000000000000000900000000000000000000000000000537000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
                __typename: 'Receipt',
              },
            ],
          },
          __typename: 'TransactionEdge',
        },
      ],
      __typename: 'TransactionConnection',
    },
  },
};

export const MOCK_TXS: Tx[] = [
  {
    id: '0x8f3e1c5b6bed5880748bbfcd534d61632c55c025dd20769a8bb4d8da8e69b964',
    operations: [
      {
        name: OperationName.transfer,
        from: {
          type: 1,
          address:
            '0x94ffcc53b892684acefaebc8a3d4a595e528a8cf664eeb3ef36f1020b0809d0d',
        },
        to: {
          type: 1,
          address:
            '0x7b3ba517cbb646dc4e9c3ecd2d973be361bb48f408286f2fd05db62de2b36422',
        },
        assetsSent: [
          {
            assetId:
              '0x0000000000000000000000000000000000000000000000000000000000000000',
            amount: '0x1dcd6500',
          },
        ],
      },
    ],
    gasUsed: bn(0),
    fee: bn(1),
    totalAssetsSent: [
      {
        assetId:
          '0x0000000000000000000000000000000000000000000000000000000000000000',
        amount: '0x1dcd6500',
      },
    ],
    isTypeCreate: false,
    isTypeScript: true,
    isTypeMint: false,
    isStatusFailure: false,
    isStatusSuccess: true,
    isStatusPending: false,
    type: TxType.script,
    status: TxStatus.success,
  },
  {
    id: '0x8f3e1c5b6bed5880748bbfcd534d61632c55c025dd20769a8bb4d8da8e69b965',
    operations: [
      {
        name: OperationName.transfer,
        from: {
          type: 1,
          address:
            '0x94ffcc53b892684acefaebc8a3d4a595e528a8cf664eeb3ef36f1020b0809d0d',
        },
        to: {
          type: 1,
          address:
            '0x7b3ba517cbb646dc4e9c3ecd2d973be361bb48f408286f2fd05db62de2b36422',
        },
        assetsSent: [
          {
            assetId:
              '0x0000000000000000000000000000000000000000000000000000000000000000',
            amount: '0x1dcd6500',
          },
        ],
      },
    ],
    gasUsed: bn(0),
    fee: bn(1),
    totalAssetsSent: [
      {
        assetId:
          '0x0000000000000000000000000000000000000000000000000000000000000000',
        amount: '0x1dcd6500',
      },
    ],
    isTypeCreate: false,
    isTypeScript: true,
    isTypeMint: false,
    isStatusFailure: false,
    isStatusSuccess: true,
    isStatusPending: false,
    type: TxType.script,
    status: TxStatus.success,
  },
];
