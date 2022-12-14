import type { Colors } from '@fuel-ui/css';

import { Status } from '.';

export const getTxStatusColor = (status?: Status): Colors => {
  switch (status) {
    case Status.pending:
      return 'amber9';
    case Status.success:
      return 'mint9';
    case Status.failure:
      return 'crimson9';
    default:
      return 'gray9';
  }
};
