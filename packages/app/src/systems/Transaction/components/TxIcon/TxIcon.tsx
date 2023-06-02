import { cssObj } from '@fuel-ui/css';
import { Box, Icon } from '@fuel-ui/react';
import type { Bech32Address } from 'fuels';

import type { Operation, TxStatus } from '../../utils';
import { getTxIconBgColor, getTxIconColor, getTxIcon } from '../../utils';

import { useAccounts } from '~/systems/Account';

export type TxIconProps = {
  operation?: Operation;
  status?: TxStatus;
};

export function TxIcon({ operation, status }: TxIconProps) {
  const { account } = useAccounts();
  return (
    <Box.Flex css={styles.root(status)}>
      <Icon
        size={22}
        icon={getTxIcon(operation, account?.address as Bech32Address)}
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
