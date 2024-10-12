import { cssObj } from '@fuel-ui/css';
import { Avatar, Box, Card, Heading, Icon, Text } from '@fuel-ui/react';
import type { OperationTransactionAddress } from 'fuels';
import { Address, AddressType, ChainName, isB256, isBech32 } from 'fuels';
import type { FC } from 'react';
import { EthAddress, FuelAddress, useAccounts } from '~/systems/Account';

import { TxRecipientCardLoader } from './TxRecipientCardLoader';

export type TxRecipientCardProps = {
  recipient?: OperationTransactionAddress;
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
  const isNetwork = address === 'Network';
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
          {isNetwork && (
            <Box css={styles.iconWrapper}>
              <Icon icon={Icon.is('LayersLinked')} size={20} />
            </Box>
          )}
          {!isContract && !isNetwork && (
            <Avatar.Generated
              role="img"
              size="lg"
              hash={fuelAddress}
              aria-label={fuelAddress}
            />
          )}
          {isContract && !isNetwork && (
            <Box css={styles.iconWrapper}>
              <Icon icon={Icon.is('Code')} size={20} />
            </Box>
          )}
          <Box.Flex css={styles.info}>
            <Heading
              as="h6"
              css={styles.name}
              aria-label={`${isReceiver ? 'Recipient' : 'Sender'} ${
                isNetwork ? 'Address' : 'Name'
              }`}
            >
              {isNetwork ? address : name}
            </Heading>
            {!isNetwork && (
              <FuelAddress
                isContract={isContract}
                address={fuelAddress}
                css={styles.address}
              />
            )}
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
    width: 56,
    height: 56,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
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
    textAlign: 'center',
  }),
};

TxRecipientCard.Loader = TxRecipientCardLoader;
