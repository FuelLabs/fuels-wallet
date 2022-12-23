import { cssObj } from '@fuel-ui/css';
import { Flex, Icon } from '@fuel-ui/react';

import type { OperationName } from '../../utils';
import { getTxIcon } from '../../utils';

import { TxIconLoader } from './TxIconLoader';

export type TxIconProps = {
  operationName?: OperationName;
};

export function TxIcon({ operationName }: TxIconProps) {
  return (
    <Flex css={styles.root}>
      <Icon icon={getTxIcon(operationName)} />
    </Flex>
  );
}

const styles = {
  root: cssObj({
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
    backgroundColor: '$gray4',
    padding: '$2',
    height: '$6',
    width: '$6',
    borderRadius: '$full',
  }),
};

TxIcon.Loader = TxIconLoader;
