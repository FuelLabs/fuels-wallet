import { cssObj } from '@fuel-ui/css';
import { Avatar, Box, Icon, Text } from '@fuel-ui/react';
import { Address, bn, isB256 } from 'fuels';
import { useMemo } from 'react';
import { EthAddress, FuelAddress, useAccounts } from '~/systems/Account';
import { useContractMetadata } from '~/systems/Contract/hooks/useContractMetadata';
import { isValidEthAddress } from '~/systems/Core';
import { useAssetsAmount } from '../../hooks/useAssetsAmount';
import { getOperationText } from '../../services/transformers/simplifyTransaction';
import { type SimplifiedOperation, TxCategory } from '../../types';
import { TxRecipientContractLogo } from '../TxRecipientCard/TxRecipientContractLogo';
import { TxOperationAssets } from './TxOperationAssets';

export type TxOperationCardProps = {
  operation: SimplifiedOperation;
};

export function TxOperationCard({ operation }: TxOperationCardProps) {
  const { assets, assetsToFrom } = operation;
  const { accounts } = useAccounts();

  const amounts = useAssetsAmount({
    operationsCoin: assets,
  });
  const amountsToFrom = useAssetsAmount({
    operationsCoin: assetsToFrom,
  });

  const isContract = operation.type === TxCategory.CONTRACTCALL;
  const isTransfer = operation.type === TxCategory.SEND;

  const hasMessageOut = useMemo(
    () => operation.receipts?.some((r) => r.type === 10),
    [operation.receipts]
  );

  const accountFrom = accounts?.find(
    (acc) => acc.address.toLowerCase() === operation.from.address.toLowerCase()
  );
  const accountTo = accounts?.find(
    (acc) => acc.address.toLowerCase() === operation.to.address.toLowerCase()
  );

  const isValidFromAddress = isB256(operation.from.address);
  const isValidToAddress = isB256(operation.to.address);

  const fuelFromAddress = isValidFromAddress
    ? Address.fromString(operation.from.address).toString()
    : '';
  const fuelToAddress = isValidToAddress
    ? Address.fromString(operation.to.address).toString()
    : '';
  const ethToAddress =
    hasMessageOut && isValidEthAddress(operation.to.address)
      ? bn(operation.to.address).toHex(20)
      : '';

  const shouldShowAssetAmount = amounts && amounts.length > 0;

  const isFromContract = operation.from.type === 0;
  const isToContract = operation.to.type === 0;
  const hasAssetsComingBack = useMemo(
    () => operation.assetsToFrom?.some((a) => a.amount.gt(0)),
    [operation.assetsToFrom]
  );

  const fromContractMetadata = useContractMetadata(operation.from.address);
  const toContractMetadata = useContractMetadata(operation.to.address);

  return (
    <Box css={styles.contentCol}>
      <Box
        css={cssObj({
          display: 'grid',
          gridTemplateColumns: 'auto 1fr',
          gridTemplateRows: 'repeat(5, auto)',
          width: '100%',
          marginBottom: '$2',
          columnGap: '$2',
          rowGap: '1px',
          margin: '0px',
        })}
      >
        <Box.Flex justify={'flex-start'} align={'center'} css={styles.iconCol}>
          <Box css={styles.icon}>
            {isFromContract ? (
              <TxRecipientContractLogo
                name={fromContractMetadata?.name}
                image={fromContractMetadata?.image}
                size={36}
              />
            ) : (
              <Avatar.Generated
                role="img"
                size={36}
                hash={fuelFromAddress}
                aria-label={fuelFromAddress}
                css={styles.avatar}
              />
            )}
          </Box>
        </Box.Flex>
        <Box.Flex
          justify={'flex-start'}
          align={'center'}
          gap="$1"
          wrap="wrap"
          aria-label="From address"
        >
          <Text as="span" fontSize="sm" css={styles.name}>
            {accountFrom?.name || 'Unknown'}
          </Text>
          {isFromContract && (
            <Box css={styles.badge}>
              <Text fontSize="sm" color="gray11">
                Contract
              </Text>
            </Box>
          )}
          <FuelAddress
            address={fuelFromAddress}
            isContract={isFromContract}
            css={styles.address}
          />
        </Box.Flex>

        <Box.Flex justify={'center'}>
          <Box css={styles.spacer} />
        </Box.Flex>
        <Box />
        <Box.Flex justify={'center'} align={'center'} css={styles.blue}>
          <Icon icon="CircleArrowDown" size={20} />
        </Box.Flex>
        <Box.Flex justify={'flex-start'} align={'center'} css={styles.blue}>
          {getOperationText({
            isContract,
            isTransfer,
            assetsAmount: amounts,
            hasMessageOut,
            isPastTense: isHistoryView,
          })}
        </Box.Flex>

        <Box.Flex justify={'center'}>
          <Box css={styles.spacer} />
        </Box.Flex>
        <Box>
          {shouldShowAssetAmount && <TxOperationAssets amounts={amounts} />}
        </Box>

        <Box.Flex justify={'flex-start'} align={'center'} css={styles.iconCol}>
          <Box css={styles.icon}>
            {isToContract ? (
              <TxRecipientContractLogo
                name={toContractMetadata?.name}
                image={toContractMetadata?.image}
                size={36}
              />
            ) : hasMessageOut ? (
              <Box css={styles.ethAvatar}>
                <Icon icon="CurrencyEthereum" size={20} stroke={1} />
              </Box>
            ) : (
              <Avatar.Generated
                role="img"
                size={36}
                hash={ethToAddress || fuelToAddress}
                aria-label={ethToAddress || fuelToAddress}
                css={styles.avatar}
              />
            )}
          </Box>
        </Box.Flex>
        <Box.Flex
          justify={'flex-start'}
          align={'center'}
          wrap="wrap"
          aria-label="To address"
        >
          <Text as="span" fontSize="sm" css={styles.name}>
            {isToContract
              ? toContractMetadata?.name || 'Unknown'
              : accountTo?.name || 'Unknown'}
          </Text>
          {ethToAddress ? (
            <EthAddress address={ethToAddress} css={styles.address} />
          ) : (
            <FuelAddress
              address={fuelToAddress}
              isContract={isToContract}
              css={styles.address}
            />
          )}
        </Box.Flex>
        {hasAssetsComingBack && (
          <>
            <Box.Flex justify={'center'}>
              <Box css={styles.spacer} />
            </Box.Flex>
            <Box />
            <Box.Flex justify={'center'} align={'center'} css={styles.blue}>
              <Icon icon="CircleArrowDown" size={20} />
            </Box.Flex>
            <Box.Flex justify={'flex-start'} align={'center'} css={styles.blue}>
              Sends funds
            </Box.Flex>

            <Box.Flex justify={'center'}>
              <Box css={styles.spacer} />
            </Box.Flex>
            <Box>
              <TxOperationAssets amounts={amountsToFrom} />
            </Box>
            <Box.Flex
              justify={'flex-start'}
              align={'center'}
              css={styles.iconCol}
            >
              <Box css={styles.icon}>
                {isFromContract ? (
                  <TxRecipientContractLogo
                    name={fromContractMetadata?.name}
                    image={fromContractMetadata?.image}
                    size={36}
                  />
                ) : (
                  <Avatar.Generated
                    role="img"
                    size={36}
                    hash={fuelFromAddress}
                    aria-label={fuelFromAddress}
                    css={styles.avatar}
                  />
                )}
              </Box>
            </Box.Flex>
            <Box.Flex
              justify={'flex-start'}
              align={'center'}
              wrap="wrap"
              aria-label="To address"
            >
              <Text as="span" fontSize="sm" css={styles.name}>
                {accountFrom?.name || 'Unknown'}
              </Text>
              {isFromContract && (
                <Box css={styles.badge}>
                  <Text fontSize="sm" color="gray11">
                    Contract
                  </Text>
                </Box>
              )}
              <FuelAddress
                address={fuelFromAddress}
                isContract={isFromContract}
                css={styles.address}
              />
            </Box.Flex>
          </>
        )}
      </Box>
    </Box>
  );
}

const styles = {
  contentCol: cssObj({
    display: 'flex',
    backgroundColor: '$bodyBg',
    'html[class="fuel_dark-theme"] &': {
      bg: '$gray3',
    },
    flex: 1,
    padding: '$4 $4 $4',
  }),
  spacer: cssObj({
    minHeight: '14px',
    width: '2px',
    height: '100%',
    backgroundColor: '$gray6',
    borderRadius: '$lg',
  }),
  iconCol: cssObj({
    padding: '2px 0',
  }),
  badge: cssObj({
    padding: '2px $1',
    backgroundColor: '$gray3',
    borderRadius: '$md',
  }),
  name: cssObj({
    fontWeight: '$semibold',
    color: '$textHeading',
    mr: '$2',
  }),
  address: cssObj({
    fontWeight: '$medium',
    fontSize: '$sm',
    color: '$textSubText',
  }),
  blue: cssObj({
    fontSize: '$sm',
    fontWeight: '$semibold',
    display: 'flex',
    alignItems: 'center',
    gap: '$1',
    color: '$indigo10',
    lineHeight: 'normal',

    'html[class="fuel_dark-theme"] &': {
      color: '$indigo11',
    },
  }),
  avatar: cssObj({
    opacity: 0.6,
  }),
  icon: cssObj({
    height: 36,
    width: 36,
    borderRadius: '$full',
    overflow: 'hidden',
    flexShrink: 0,
  }),
  ethAvatar: cssObj({
    height: 34,
    width: 34,
    borderRadius: '$full',
    overflow: 'hidden',
    flexShrink: 0,
    border: '1px solid $gray6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }),
} as const;
