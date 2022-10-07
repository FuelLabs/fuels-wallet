import { MOCK_TX_RECIPIENT } from '../../__mocks__/tx-recipient';
import { TxState } from '../../types';

import type { TxFromToProps } from './TxFromTo';
import { TxFromTo } from './TxFromTo';

export default {
  component: TxFromTo,
  title: 'Transaction/Components/TxFromTo',
};

const { account: ACCOUNT, contract: CONTRACT } = MOCK_TX_RECIPIENT;

export const Default = (args: TxFromToProps) => (
  <TxFromTo {...args} from={ACCOUNT} to={CONTRACT} />
);
export const Pending = (args: TxFromToProps) => (
  <TxFromTo {...args} from={ACCOUNT} to={CONTRACT} state={TxState.pending} />
);
export const Success = (args: TxFromToProps) => (
  <TxFromTo {...args} from={ACCOUNT} to={CONTRACT} state={TxState.success} />
);
export const Failed = (args: TxFromToProps) => (
  <TxFromTo {...args} from={ACCOUNT} to={CONTRACT} state={TxState.failed} />
);
