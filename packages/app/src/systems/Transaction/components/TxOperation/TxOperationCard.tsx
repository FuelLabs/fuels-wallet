import { type ThemeUtilsCSS, cssObj } from '@fuel-ui/css';
import { Avatar, Box, Icon, Text } from '@fuel-ui/react';
import type { AssetFuelAmount, AssetFuelData } from '@fuel-wallet/types';
import { Address, isB256 } from 'fuels';
import { useEffect, useState } from 'react';
import { FuelAddress, useAccounts } from '~/systems/Account';
import { AssetsCache } from '~/systems/Asset/cache/AssetsCache';
import { MotionBox } from '~/systems/Core/components/Motion';
import { useProvider } from '~/systems/Network/hooks/useProvider';
import { type SimplifiedOperation, TxCategory } from '../../types';
import { TxOperationAssets } from './TxOperationAssets';

export type TxOperationCardProps = {
  operation: SimplifiedOperation;
  assetsAmount?: AssetFuelAmount[];
  css?: ThemeUtilsCSS;
};

export function TxOperationCard({
  operation,
  assetsAmount,
  css,
}: TxOperationCardProps) {
  const { metadata } = operation;
  const { accounts } = useAccounts();
  const provider = useProvider();
  const [baseAsset, setBaseAsset] = useState<AssetFuelData | undefined>();

  // Fetch base asset info for USD conversion
  useEffect(() => {
    let abort = false;
    const getBaseAsset = async () => {
      const [baseAssetId, chainId] = await Promise.all([
        provider?.getBaseAssetId(),
        provider?.getChainId(),
      ]);
      if (abort || baseAssetId == null || chainId == null) return;
      const baseAsset = await AssetsCache.getInstance().getAsset({
        chainId: chainId,
        assetId: baseAssetId,
        dbAssets: [],
        save: false,
      });
      if (abort) return;
      setBaseAsset(baseAsset);
    };
    getBaseAsset();
    return () => {
      abort = true;
    };
  }, [provider]);

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

  const getOperationType = () => {
    if (isContract) {
      if (assetsAmount && assetsAmount.length > 0) {
        return 'Calls contract (sending funds)';
      }
      return 'Calls contract';
    }
    if (isTransfer) return 'Sends token';
    return 'Unknown';
  };

  const shouldShowAssetAmount = assetsAmount && assetsAmount.length > 0;

  const isFromContract = operation.from.type === 0;
  const isToContract = operation.to.type === 0;

  return (
    <Box css={styles.contentCol(metadata.direction)} style={css}>
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
        {metadata.direction !== 'out' && (
          <>
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
          </>
        )}

        <Box.Flex justify={'center'}>
          <Box css={styles.spacer} />
        </Box.Flex>
        <Box />
        <Box.Flex justify={'center'} align={'center'} css={styles.blue}>
          <Icon icon="CircleArrowDown" size={20} />
        </Box.Flex>
        <Box.Flex justify={'flex-start'} align={'center'} css={styles.blue}>
          {getOperationType()}
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
              <TxOperationAssets amounts={assetsAmount} baseAsset={baseAsset} />
            </MotionBox>
          )}
        </Box>

        <Box.Flex justify={'flex-start'} align={'center'} css={styles.iconCol}>
          <Avatar.Generated
            role="img"
            size="sm"
            hash={fuelToAddress}
            aria-label={fuelToAddress}
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
      </Box>
    </Box>
  );
}

const styles = {
  contentCol: (direction: 'in' | 'out' | undefined) =>
    cssObj({
      display: 'flex',
      backgroundColor: '$bodyBg',
      // boxShadow: bidirectionalInfo
      //   ? 'none'
      //   : '0px 2px 6px -1px #2020201A, 0px 0px 0px 1px #2020201F',
      // boxShadow:
      //   '0px 0px 0px 1px rgba(32, 32, 32, 0.12), 0px 2px 6px -1px rgba(32, 32, 32, 0.10)',
      flex: 1,
      padding: `${direction === 'out' ? '0' : '$4'} $4 ${direction === 'in' ? '0' : '$4'}`,
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
    color: '$gray12',
    mr: '$1',
  }),
  address: cssObj({
    fontWeight: '$medium',
    fontSize: '$sm',
    color: '$gray11',
  }),
  blue: cssObj({
    fontSize: '$sm',
    display: 'flex',
    alignItems: 'center',
    gap: '$1',
    color: '$indigo10',
    lineHeight: 'normal',
  }),
  amountContainer: cssObj({
    fontWeight: '$semibold',
    color: '$gray12',
    fontSize: '$sm',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: 'flex',
    flexDirection: 'column',
    gap: '$1',
  }),
};
