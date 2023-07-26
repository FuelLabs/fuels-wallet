import { bn, BaseAssetId } from 'fuels';

import type { Operation } from '../utils';
import { OperationName } from '../utils';

import { MOCK_TX_RECIPIENT } from './tx-recipient';

export const MOCK_OPERATION_CONTRACT_CALL: Operation = {
  name: OperationName.contractCall,
  from: MOCK_TX_RECIPIENT.account,
  to: MOCK_TX_RECIPIENT.contract,
  assetsSent: [
    {
      amount: bn.parseUnits('0.10001'),
      assetId: BaseAssetId,
    },
  ],
  calls: [
    {
      functionName: 'mint_to_address',
      functionSignature: 'mint_to_address(u64,s(b256),u64)',
      argumentsProvided: {
        address: {
          value:
            '0xa5a77a7d97c6708b08de873528ae6879ef5e9900fbc2e3f3cb74e28917bf7038',
        },
        amount: '0x64',
        amount2: '0x64',
      },
      amount: bn('0x5f5e100'),
      assetId:
        '0x0000000000000000000000000000000000000000000000000000000000000000',
    },
  ],
};

export const MOCK_OPERATION_TRANSFER: Operation = {
  name: OperationName.transfer,
  from: MOCK_TX_RECIPIENT.account,
  to: {
    ...MOCK_TX_RECIPIENT.account,
    address: 'fuel1auahknz6mjuu0am034mlggh55f0tgp9j7fkzrc6xl48zuy5zv7vqa07n30',
  },
  assetsSent: [
    {
      amount: bn.parseUnits('0.52'),
      assetId: BaseAssetId,
    },
  ],
};

export const MOCK_OPERATION_CONTRACT_CREATED: Operation = {
  name: OperationName.contractCreated,
  from: MOCK_TX_RECIPIENT.account,
  to: {
    ...MOCK_TX_RECIPIENT.account,
    address: 'fuel1auahknz6mjuu0am034mlggh55f0tgp9j7fkzrc6xl48zuy5zv7vqa07n30',
  },
};

export const MOCK_OPERATION_MINT: Operation = {
  name: OperationName.payBlockProducer,
  from: { ...MOCK_TX_RECIPIENT.account, address: 'Network' },
  to: {
    ...MOCK_TX_RECIPIENT.account,
    address: 'fuel1auahknz6mjuu0am034mlggh55f0tgp9j7fkzrc6xl48zuy5zv7vqa07n30',
  },
  assetsSent: [
    {
      assetId:
        '0x0000000000000000000000000000000000000000000000000000000000000000',
      amount: bn(1),
    },
  ],
};
