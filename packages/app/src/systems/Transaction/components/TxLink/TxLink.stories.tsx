import type { TxLinkProps } from '.';
import { TxLink } from '.';

export default {
  component: TxLink,
  title: 'Transaction/Components/TxLink',
};

export const Usage = (args: TxLinkProps) => <TxLink {...args} />;
Usage.args = {
  txHash: '0xc019789a1d43f6ed799bcd4abf6b5a69ce91e60710e3bc6ab3b2ca0996cdef4d',
  providerUrl: 'http://localhost:4000',
};
