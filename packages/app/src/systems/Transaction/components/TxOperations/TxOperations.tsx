import { cssObj } from '@fuel-ui/css';
import { Flex } from '@fuel-ui/react';
import type { Asset } from '@fuel-wallet/types';

import type { Operation, TxStatus } from '../../utils';
import { TxOperation } from '../TxOperation/TxOperation';

import type { Maybe } from '~/systems/Core';

export type TxOperationsProps = {
  operations?: Operation[];
  status?: Maybe<TxStatus>;
  assets?: Maybe<Asset[]>;
  isLoading?: boolean;
};

export function TxOperations({
  operations,
  status,
  assets,
  isLoading,
}: TxOperationsProps) {
  return (
    <Flex css={styles.root}>
      {operations?.map((operation, index) => (
        <TxOperation
          key={index}
          operation={operation}
          status={status}
          assets={assets}
          isLoading={isLoading}
        />
      ))}
    </Flex>
  );
}

TxOperations.Loader = () => (
  <Flex css={styles.root}>
    <TxOperation.Loader />
  </Flex>
);

const styles = {
  root: cssObj({
    gap: '$4',
    flexDirection: 'column',
  }),
};
