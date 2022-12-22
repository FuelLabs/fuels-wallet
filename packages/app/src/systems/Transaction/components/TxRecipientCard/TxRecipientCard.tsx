import { cssObj } from '@fuel-ui/css';
import { Avatar, Box, Card, Copyable, Flex, Icon, Text } from '@fuel-ui/react';
import { AddressType } from '@fuel-wallet/types';
import { isB256, isBech32 } from 'fuels';
import type { FC } from 'react';

import type { TxRecipientAddress } from '../../types';

import { TxRecipientCardLoader } from './TxRecipientCardLoader';

import { shortAddress } from '~/systems/Core';

export type TxRecipientCardProps = {
  recipient?: TxRecipientAddress;
  isReceiver?: boolean;
};

type TxRecipientCardComponent = FC<TxRecipientCardProps> & {
  Loader: typeof TxRecipientCardLoader;
};

export const TxRecipientCard: TxRecipientCardComponent = ({
  recipient,
  isReceiver,
}) => {
  const address = recipient?.address || '';
  const isContract = recipient?.type === AddressType.contract;
  const isValidAddress = isB256(address) || isBech32(address);

  return (
    <Card css={styles.root}>
      <Text css={styles.from}>
        {isReceiver ? 'To' : 'From'} {isContract && '(Contract)'}
      </Text>
      {address && (
        <>
          {!isContract && (
            <Avatar.Generated
              role="img"
              size="lg"
              hash={address}
              aria-label="Generated Address"
              background="fuel"
            />
          )}
          {isContract && (
            <Box css={styles.iconWrapper}>
              <Icon icon={Icon.is('Code')} size={16} />
            </Box>
          )}
          <Flex css={styles.info}>
            <Copyable value={address} data-invalid-address={!isValidAddress}>
              {shortAddress(address)}
            </Copyable>
          </Flex>
        </>
      )}
    </Card>
  );
};

const styles = {
  root: cssObj({
    flex: 1,
    p: '$3',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '$3',

    '.fuel_copyable': {
      color: '$gray12',
      fontSize: '$sm',
      fontWeight: '$semibold',
    },
    '.fuel_avatar-generated': {
      width: 56,
      height: 56,
      '& svg': {
        width: 56,
        height: 56,
      },
    },
  }),
  from: cssObj({
    fontSize: '$sm',
    fontWeight: '$semibold',
  }),
  iconWrapper: cssObj({
    padding: '$5',
    background: '$gray3',
    borderRadius: '$full',
  }),
  info: cssObj({
    flexDirection: 'column',
    alignItems: 'center',
    gap: '$1',

    '.fuel_copyable': {
      fontSize: '$xs',
      // to make sure we're using same text format, we just hide the copy icon but still use Copyable.
      '&[data-invalid-address="true"]': {
        '.fuel_copyable-icon': {
          display: 'none',
        },
      },
    },
  }),
};

TxRecipientCard.Loader = TxRecipientCardLoader;
