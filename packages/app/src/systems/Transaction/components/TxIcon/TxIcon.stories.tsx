import type { Meta, StoryFn } from '@storybook/react';
import { OperationName } from 'fuels';

import {
  MOCK_OPERATION_CONTRACT_CALL,
  MOCK_OPERATION_CONTRACT_CREATED,
} from '../../__mocks__/operation';

import type { TxIconProps } from './TxIcon';
import { TxIcon } from './TxIcon';

export default {
  component: TxIcon,
  title: 'Transaction/Components/TxIcon',
} as Meta<typeof TxIcon>;

const Template: StoryFn<typeof TxIcon> = (args: TxIconProps) => (
  <TxIcon {...args} />
);

export const ContractCreated = Template.bind({});
ContractCreated.args = {
  operation: MOCK_OPERATION_CONTRACT_CREATED,
};
export const ContractCall = Template.bind({});
ContractCall.args = {
  operation: MOCK_OPERATION_CONTRACT_CALL,
};
export const Script = Template.bind({});
Script.args = {
  operation: { ...MOCK_OPERATION_CONTRACT_CALL, name: OperationName.script },
};
export const PredicateCall = Template.bind({});
PredicateCall.args = {
  operation: {
    ...MOCK_OPERATION_CONTRACT_CALL,
    name: OperationName.predicatecall,
  },
};
