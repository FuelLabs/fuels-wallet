import { cssObj } from '@fuel-ui/css';
import { Flex, Icon } from '@fuel-ui/react';
import type { FC } from 'react';

import type { Transaction } from '../../types';
import { getTxIconColor } from '../../utils';

import { TxIconLoader } from './TxIconLoader';

export type TxIconProps = {
  transaction: Omit<Transaction, 'data'>;
};

type TxIconComponent = FC<TxIconProps> & {
  Loader: typeof TxIconLoader;
};

export const TxIcon: TxIconComponent = ({ transaction }) => {
  const { color, backgroundColor } = getTxIconColor(transaction.status);

  return (
    <Flex css={styles.root(backgroundColor)}>
      <Icon
        icon={Icon.is('CopySimple')}
        color={color}
        aria-label={`TxIcon Color: ${color}`}
        size={20}
      />
    </Flex>
  );
};

const styles = {
  root: (backgroundColor: string) =>
    cssObj({
      p: '$3',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '$2',
      backgroundColor: `$${backgroundColor}`,
      fontWeight: '$semibold',
      borderRadius: '100%',
      width: '$4',
      height: '$4',
    }),
};

TxIcon.Loader = TxIconLoader;
