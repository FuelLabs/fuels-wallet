import { bn, NativeAssetId } from 'fuels';

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
      assetId: NativeAssetId,
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
      assetId: NativeAssetId,
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
