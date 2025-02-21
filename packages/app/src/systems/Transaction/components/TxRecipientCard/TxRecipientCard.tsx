import { cssObj } from '@fuel-ui/css';
import {
  Avatar,
  Box,
  Card,
  Heading,
  Icon,
  Image,
  Text,
  Tooltip,
} from '@fuel-ui/react';
import type { OperationTransactionAddress } from 'fuels';
import { Address, AddressType, ChainName, isB256 } from 'fuels';
import { type FC, useEffect, useMemo, useRef, useState } from 'react';
import { EthAddress, FuelAddress, useAccounts } from '~/systems/Account';

import { useContractMetadata } from '~/systems/Contract/hooks/useContractMetadata';
import { TxRecipientCardLoader } from './TxRecipientCardLoader';
import { TxRecipientContractLogo } from './TxRecipientContractLogo';

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
  const isValidAddress = isB256(address);
  const fuelAddress = isValidAddress
    ? Address.fromDynamicInput(address).toString()
    : '';
  const isContract = recipient?.type === AddressType.contract;
  const isEthChain = recipient?.chain === ChainName.ethereum;
  const isNetwork = address === 'Network';

  const contract = useContractMetadata(address);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const [isTruncated, setIsTruncated] = useState(false);

  const name = useMemo<string>(() => {
    if (isContract) {
      return contract?.name || 'unknown';
    }

    return accounts?.find((a) => a.address === fuelAddress)?.name || 'unknown';
  }, [isContract, contract, accounts, fuelAddress]);

  useEffect(() => {
    const checkIfTruncated = () => {
      if (nameRef.current) {
        const isNameTruncated =
          nameRef.current.offsetWidth < nameRef.current.scrollWidth;
        setIsTruncated(isNameTruncated);
      }
    };

    checkIfTruncated();
    window.addEventListener('resize', checkIfTruncated);

    return () => {
      window.removeEventListener('resize', checkIfTruncated);
    };
  }, [name]);

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
              <TxRecipientContractLogo
                name={contract?.name}
                image={contract?.image}
                size={56}
              />
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
              <Tooltip content={name} open={isTruncated ? undefined : false}>
                <div
                  ref={nameRef}
                  style={{
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    maxWidth: '100px',
                  }}
                >
                  {name}
                </div>
              </Tooltip>
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
    overflow: 'hidden',
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
