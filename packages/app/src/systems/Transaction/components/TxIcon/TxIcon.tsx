import { cssObj } from '@fuel-ui/css';
import { Box, Icon } from '@fuel-ui/react';

import type { OperationName, TxStatus } from '../../utils';
import { getTxIconBgColor, getTxIconColor, getTxIcon } from '../../utils';

export type TxIconProps = {
  operationName?: OperationName;
  status?: TxStatus;
};

export function TxIcon({ operationName, status }: TxIconProps) {
  return (
    <Box.Flex css={styles.root(status)}>
      <Icon
        size={22}
        icon={getTxIcon(operationName)}
        color={getTxIconColor(status)}
      />
    </Box.Flex>
  );
}

const styles = {
  root: (status: TxStatus | undefined) =>
    cssObj({
      alignItems: 'center',
      justifyContent: 'center',
      display: 'flex',
      backgroundColor: getTxIconBgColor(status),
      padding: '$2',
      height: '$6',
      width: '$6',
      borderRadius: '$full',
    }),
};
