import { cssObj } from '@fuel-ui/css';
import { Avatar, Box, Card, Heading, Icon, Text } from '@fuel-ui/react';
import { AddressType } from '@fuel-wallet/types';
import { Address, isB256, isBech32 } from 'fuels';
import type { FC } from 'react';

import type { TxAddress } from '../../utils';
import { ChainName } from '../../utils';

import { TxRecipientCardLoader } from './TxRecipientCardLoader';

import { EthAddress, FuelAddress, useAccounts } from '~/systems/Account';

export type TxRecipientCardProps = {
  recipient?: TxAddress;
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
  const isEthChain = recipient?.chain === ChainName.ethereum;
  const name =
    accounts?.find((a) => a.address === fuelAddress)?.name || 'unknown';

  return (
    <Card
      css={styles.root}
      className="TxRecipientCard"
      data-recipient={address}
      data-type={isContract ? 'contract' : 'user'}
    >
      <Text css={styles.from}>
        {isReceiver ? 'To' : 'From'} {isContract && '(Contract)'}{' '}
        {isEthChain && '(Ethereum)'}
      </Text>
      {isEthChain ? (
        <>
          <Box css={styles.iconWrapper}>
            <Icon icon={Icon.is('CurrencyEthereum')} size={20} />
          </Box>
          <Box.Flex css={styles.info}>
            <Heading as="h6" css={styles.name}>
              unknown
            </Heading>
            <EthAddress address={address} css={styles.address} />
          </Box.Flex>
        </>
      ) : (
        <>
          {!isContract && (
            <Avatar.Generated
              role="img"
              size="lg"
              hash={fuelAddress}
              aria-label={fuelAddress}
            />
          )}
          {isContract && (
            <Box css={styles.iconWrapper}>
              <Icon icon={Icon.is('Code')} size={20} />
            </Box>
          )}
          <Box.Flex css={styles.info}>
            <Heading as="h6" css={styles.name}>
              {name}
            </Heading>
            <FuelAddress address={fuelAddress} css={styles.address} />
          </Box.Flex>
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
    flexDirection: 'column',
    gap: '$3',

    '.fuel_copyable': {
      color: '$intentsBase12',
      fontSize: '$sm',
    },
    '.fuel_Avatar-generated': {
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
    fontWeight: '$normal',
  }),
  iconWrapper: cssObj({
    padding: '$5',
    background: '$intentsBase3',
    borderRadius: '$full',
  }),
  info: cssObj({
    flexDirection: 'column',
    alignItems: 'center',
    gap: '$1',
  }),
  address: cssObj({
    fontSize: '$sm',
  }),
  name: cssObj({
    margin: '0px 0px -5px',
  }),
};

TxRecipientCard.Loader = TxRecipientCardLoader;
