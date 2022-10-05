import { TxState } from '../../types';

import type { TxFromToProps } from './TxFromTo';
import { TxFromTo } from './TxFromTo';

export default {
  component: TxFromTo,
  title: 'Transaction/Components/TxFromTo',
};

const ACCOUNT = {
  address: 'fuel1yal7nrhm4lpwuzjn8eq3qjlsk9366dwpsrpd5ns5q049g30kyp7qcey6wk',
};

const CONTRACT = {
  address: '0x277fe98efbafc2ee0a533e41104bf0b163ad35c180c2da4e1403ea5445f6207c',
};

export const Default = (args: TxFromToProps) => (
  <TxFromTo {...args} from={ACCOUNT.address} to={CONTRACT.address} />
);
export const Pending = (args: TxFromToProps) => (
  <TxFromTo
    {...args}
    from={ACCOUNT.address}
    to={CONTRACT.address}
    state={TxState.pending}
  />
);
export const Success = (args: TxFromToProps) => (
  <TxFromTo
    {...args}
    from={ACCOUNT.address}
    to={CONTRACT.address}
    state={TxState.success}
  />
);
export const Failed = (args: TxFromToProps) => (
  <TxFromTo
    {...args}
    from={ACCOUNT.address}
    to={CONTRACT.address}
    state={TxState.failed}
  />
);
