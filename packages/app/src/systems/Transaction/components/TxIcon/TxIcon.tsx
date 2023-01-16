import { cssObj } from '@fuel-ui/css';
import { Flex, Icon } from '@fuel-ui/react';

import type { OperationName, TxStatus } from '../../utils';
import { getTxIconBgColor, getTxIconColor, getTxIcon } from '../../utils';

import { TxIconLoader } from './TxIconLoader';

export type TxIconProps = {
  operationName?: OperationName;
  status?: TxStatus;
};

export function TxIcon({ operationName, status }: TxIconProps) {
  return (
    <Flex css={styles.root(status)}>
      <Icon
        size="22px"
        icon={getTxIcon(operationName)}
        color={getTxIconColor(status)}
      />
    </Flex>
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

TxIcon.Loader = TxIconLoader;
