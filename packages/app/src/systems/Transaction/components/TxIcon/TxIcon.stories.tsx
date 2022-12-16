import { TransactionType } from 'fuels';

import type { TxIconProps } from './TxIcon';
import { TxIcon } from './TxIcon';

export default {
  component: TxIcon,
  title: 'Transaction/Components/TxIcon',
  argTypes: {
    transactionType: {
      options: Object.values(TransactionType).filter(
        (type) => typeof type !== 'string'
      ),
      control: {
        type: 'radio',
        labels: Object.values(TransactionType).filter(
          (type) => typeof type === 'string'
        ),
      },
    },
  },
};

export const Default = (args: TxIconProps) => <TxIcon {...args} />;

export const Loader = () => <TxIcon.Loader />;
