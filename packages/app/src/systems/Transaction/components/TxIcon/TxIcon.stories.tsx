import { OperationName } from '../../utils';

import type { TxIconProps } from './TxIcon';
import { TxIcon } from './TxIcon';

export default {
  component: TxIcon,
  title: 'Transaction/Components/TxIcon',
};

export const Usage = (args: TxIconProps) => <TxIcon {...args} />;

export const ContractCreated = () => (
  <TxIcon operationName={OperationName.contractCreated} />
);

export const ContractCall = () => (
  <TxIcon operationName={OperationName.contractCall} />
);

export const Script = () => <TxIcon operationName={OperationName.script} />;

export const PredicateCall = () => (
  <TxIcon operationName={OperationName.predicatecall} />
);

export const Loader = () => <TxIcon.Loader />;
