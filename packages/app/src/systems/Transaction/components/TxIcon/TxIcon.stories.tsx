import type { TxIconProps } from './TxIcon';
import { TxIcon } from './TxIcon';

export default {
  component: TxIcon,
  title: 'Transaction/Components/TxIcon',
};

export const Default = (args: TxIconProps) => <TxIcon {...args} />;

export const Loader = () => <TxIcon.Loader />;
