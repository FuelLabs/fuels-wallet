import { cssObj } from '@fuel-ui/css';
import { Avatar, Box, Card, Flex, Heading, Icon, Text } from '@fuel-ui/react';
import { AddressType } from '@fuel-wallet/types';
import { Address, isB256, isBech32 } from 'fuels';
import type { FC } from 'react';

import type { TxRecipientAddress } from '../../types';

import { TxRecipientCardLoader } from './TxRecipientCardLoader';

import { FuelAddress, useAccounts } from '~/systems/Account';

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
  const { accounts } = useAccounts();
  const address = recipient?.address || '';
  const isValidAddress = isB256(address) || isBech32(address);
  const fuelAddress = isValidAddress
    ? Address.fromString(address).toString()
    : '';
  const isContract = recipient?.type === AddressType.contract;
  const name =
    accounts?.find((a) => a.address === fuelAddress)?.name || 'unknown';

  return (
    <Card
      css={styles.root}
      className="tx-recipient-card"
      data-recipient={address}
      data-type={isContract ? 'contract' : 'user'}
    >
      <Text css={styles.from}>
        {isReceiver ? 'To' : 'From'} {isContract && '(Contract)'}
      </Text>
      {address && (
        <>
          {!isContract && (
            <Avatar.Generated
              role="img"
              size="lg"
              hash={fuelAddress}
              aria-label={fuelAddress}
              background="fuel"
            />
          )}
          {isContract && (
            <Box css={styles.iconWrapper}>
              <Icon icon={Icon.is('Code')} size={16} />
            </Box>
          )}
          <Flex css={styles.info}>
            <Heading as="h6" css={styles.name}>
              {name}
            </Heading>
            <FuelAddress address={fuelAddress} css={styles.address} />
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
  }),
  address: cssObj({
    fontSize: '$xs',
  }),
  name: cssObj({
    margin: '0px 0px -5px',
  }),
};

TxRecipientCard.Loader = TxRecipientCardLoader;
