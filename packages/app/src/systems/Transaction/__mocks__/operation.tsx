import { bn } from 'fuels';

import type { Operation } from '../utils';

import { MOCK_TX_RECIPIENT } from './tx-recipient';

import { ASSET_LIST } from '~/systems/Asset';

export const MOCK_OPERATION: Operation = {
  from: MOCK_TX_RECIPIENT.account,
  to: MOCK_TX_RECIPIENT.contract,
  assetsSent: [
    {
      amount: bn.parseUnits('0.10001'),
      assetId: ASSET_LIST[0].assetId,
    },
    {
      amount: bn.parseUnits('2014.001200917'),
      assetId: ASSET_LIST[1].assetId,
    },
  ],
};
