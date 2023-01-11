import type { ComponentStory, ComponentMeta } from '@storybook/react';

import { OperationName } from '../../utils';

import type { TxIconProps } from './TxIcon';
import { TxIcon } from './TxIcon';

export default {
  component: TxIcon,
  title: 'Transaction/Components/TxIcon',
} as ComponentMeta<typeof TxIcon>;

const Template: ComponentStory<typeof TxIcon> = (args: TxIconProps) => (
  <TxIcon {...args} />
);

export const ContractCreated = Template.bind({});
ContractCreated.args = {
  operationName: OperationName.contractCreated,
};
export const ContractCall = Template.bind({});
ContractCall.args = {
  operationName: OperationName.contractCall,
};
export const Script = Template.bind({});
Script.args = {
  operationName: OperationName.script,
};
export const PredicateCall = Template.bind({});
PredicateCall.args = {
  operationName: OperationName.predicatecall,
};
