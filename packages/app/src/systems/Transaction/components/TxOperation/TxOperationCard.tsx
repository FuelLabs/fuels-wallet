import { cssObj } from '@fuel-ui/css';
import { Avatar, Box, Icon, Text } from '@fuel-ui/react';
import { Address, isB256 } from 'fuels';
import { useMemo } from 'react';
import { FuelAddress, useAccounts } from '~/systems/Account';
import { MotionBox } from '~/systems/Core/components/Motion';
import { useAssetsAmount } from '../../hooks/useAssetsAmount';
import { useBaseAsset } from '../../hooks/useBaseAsset';
import { type SimplifiedOperation, TxCategory } from '../../types';
import { getOperationText } from '../../utils/simplifyTransaction';
import { TxOperationAssets } from './TxOperationAssets';

export type TxOperationCardProps = {
  operation: SimplifiedOperation;
};

export function TxOperationCard({ operation }: TxOperationCardProps) {
  const { assets, assetsToFrom } = operation;
  const { accounts } = useAccounts();
  const baseAsset = useBaseAsset();

  const amounts = useAssetsAmount({
    operationsCoin: assets,
  });
  const amountsToFrom = useAssetsAmount({
    operationsCoin: assetsToFrom,
  });

  const isContract = operation.type === TxCategory.CONTRACTCALL;
  const isTransfer = operation.type === TxCategory.SEND;

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

  const shouldShowAssetAmount = amounts && amounts.length > 0;

  const isFromContract = operation.from.type === 0;
  const isToContract = operation.to.type === 0;
  const hasAssetsComingBack = useMemo(
    () => operation.assetsToFrom?.some((a) => a.amount.gt(0)),
    [operation.assetsToFrom]
  );

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
          <Avatar.Generated
            role="img"
            size="sm"
            hash={fuelFromAddress}
            aria-label={fuelFromAddress}
            css={styles.avatar}
          />
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
          {getOperationText(isContract, isTransfer, amounts)}
        </Box.Flex>

        <Box.Flex justify={'center'}>
          <Box css={styles.spacer} />
        </Box.Flex>
        <Box>
          {shouldShowAssetAmount && (
            <MotionBox
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: 'easeIn' }}
            >
              <TxOperationAssets amounts={amounts} baseAsset={baseAsset} />
            </MotionBox>
          )}
        </Box>

        <Box.Flex justify={'flex-start'} align={'center'} css={styles.iconCol}>
          <Avatar.Generated
            role="img"
            size="sm"
            hash={fuelToAddress}
            aria-label={fuelToAddress}
            css={styles.avatar}
          />
        </Box.Flex>
        <Box.Flex
          justify={'flex-start'}
          align={'center'}
          gap="$1"
          wrap="wrap"
          aria-label="To address"
        >
          <Text as="span" fontSize="sm" css={styles.name}>
            {accountTo?.name || 'Unknown'}
          </Text>
          {isToContract && (
            <Box css={styles.badge}>
              <Text fontSize="sm" color="gray11">
                Contract
              </Text>
            </Box>
          )}
          <FuelAddress
            address={fuelToAddress}
            isContract={isToContract}
            css={styles.address}
          />
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
              Sends token
            </Box.Flex>

            <Box.Flex justify={'center'}>
              <Box css={styles.spacer} />
            </Box.Flex>
            <Box>
              <MotionBox
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: 'easeIn' }}
              >
                <TxOperationAssets
                  amounts={amountsToFrom}
                  baseAsset={baseAsset}
                />
              </MotionBox>
            </Box>
            <Box.Flex
              justify={'flex-start'}
              align={'center'}
              css={styles.iconCol}
            >
              <Avatar.Generated
                role="img"
                size="sm"
                hash={fuelFromAddress}
                aria-label={fuelFromAddress}
                css={styles.avatar}
              />
            </Box.Flex>
            <Box.Flex
              justify={'flex-start'}
              align={'center'}
              gap="$1"
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
    mr: '$1',
  }),
  address: cssObj({
    fontWeight: '$medium',
    fontSize: '$sm',
    color: '$textSubText',
  }),
  blue: cssObj({
    fontSize: '$sm',
    display: 'flex',
    alignItems: 'center',
    gap: '$1',
    color: '$indigo10',
    lineHeight: 'normal',
  }),
  avatar: cssObj({
    // apply opacity to make the avatar color less alive and more opaque
    opacity: 0.6,
  }),
};
