import { cssObj } from '@fuel-ui/css';
import { Flex } from '@fuel-ui/react';

import type { Operation, Status } from '../../utils';
import { TxOperation } from '../TxOperation/TxOperation';

export type TxOperationsProps = {
  operations?: Operation[];
  status?: Status;
};

export function TxOperations({ operations, status }: TxOperationsProps) {
  return (
    <Flex css={styles.root}>
      {operations?.map((operation, index) => (
        <TxOperation key={index} operation={operation} status={status} />
      ))}
    </Flex>
  );
}

const styles = {
  root: cssObj({
    gap: '$4',
    flexDirection: 'column',
  }),
};
