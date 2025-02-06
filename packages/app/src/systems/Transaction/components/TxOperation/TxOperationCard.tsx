import { cssObj } from '@fuel-ui/css';
import {
  Avatar,
  Badge,
  Box,
  Icon,
  IconButton,
  Image,
  Text,
} from '@fuel-ui/react';
import type { AssetFuelAmount, AssetFuelData } from '@fuel-wallet/types';
import { Address, bn, isB256, isBech32 } from 'fuels';
import { useEffect, useState } from 'react';
import { useAccounts } from '~/systems/Account';
import { AssetsCache } from '~/systems/Asset/cache/AssetsCache';
import { formatAmount, shortAddress } from '~/systems/Core';
import { convertToUsd } from '~/systems/Core/utils/convertToUsd';
import { useProvider } from '~/systems/Network/hooks/useProvider';
import { type SimplifiedOperation, TxCategory } from '../../types';

type TxOperationCardProps = {
  operation: SimplifiedOperation;
  assetsAmount: AssetFuelAmount[];
  depth: number;
  flat?: boolean;
};

export function TxOperationCard({
  operation,
  assetsAmount,
  depth,
  flat = false,
}: TxOperationCardProps) {
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

  const isValidFromAddress =
    isB256(operation.from.address) || isBech32(operation.from.address);
  const isValidToAddress =
    isB256(operation.to.address) || isBech32(operation.to.address);

  const fuelFromAddress = isValidFromAddress
    ? Address.fromString(operation.from.address).toString()
    : '';
  const fuelToAddress = isValidToAddress
    ? Address.fromString(operation.to.address).toString()
    : '';

  const getOperationType = () => {
    if (isContract) {
      if (operation.metadata?.amount && operation.metadata?.assetId) {
        return 'Calls contract (sending funds)';
      }
      return 'Calls contract';
    }
    if (isTransfer) return 'Sends token';
    return 'Unknown';
  };

  const shouldShowAssetAmount = assetsAmount?.length > 0;

  const isFromContract = operation.from.type === 0;
  const isToContract = operation.to.type === 0;

  const renderAssets = (amounts: AssetFuelAmount[]) => {
    const allEmptyAmounts = amounts.every((assetAmount) =>
      bn(assetAmount.amount).eq(0)
    );

    if (allEmptyAmounts) return null;

    const getAssetImage = (asset: AssetFuelAmount) => {
      if (asset?.icon) {
        return (
          <Image
            src={asset.icon}
            alt={`${asset.name} image`}
            width="24px"
            height="24px"
          />
        );
      }

      return (
        <Avatar.Generated
          hash={asset?.assetId || asset?.name || ''}
          aria-label={`${asset?.name} generated image`}
          size="xsm"
        />
      );
    };

    return (
      <Box css={cssObj({ marginBottom: '$3' })}>
        <Box.Stack gap="$1">
          {amounts.map(
            (assetAmount) =>
              bn(assetAmount.amount).gt(0) && (
                <Box.Flex css={styles.asset} key={assetAmount.assetId}>
                  {getAssetImage(assetAmount)}
                  <Box css={styles.amountContainer}>
                    <Box.Flex direction="column">
                      <Box.Flex gap="$1" aria-label="amount-container">
                        <Text as="span" className="amount-value">
                          {formatAmount({
                            amount: assetAmount.amount,
                            options: {
                              units: assetAmount.decimals || 0,
                              precision: assetAmount.decimals || 0,
                            },
                          })}{' '}
                          {assetAmount.symbol || 'Unknown'}
                        </Text>
                        {baseAsset?.rate &&
                          assetAmount.amount &&
                          assetAmount.assetId === baseAsset.assetId && (
                            <Text color="gray8">
                              (
                              {
                                convertToUsd(
                                  bn(assetAmount.amount),
                                  assetAmount.decimals,
                                  baseAsset.rate
                                ).formatted
                              }
                              )
                            </Text>
                          )}
                        {assetAmount.isNft && (
                          <Badge
                            variant="ghost"
                            intent="primary"
                            css={styles.assetNft}
                          >
                            NFT
                          </Badge>
                        )}
                      </Box.Flex>
                    </Box.Flex>
                  </Box>
                </Box.Flex>
              )
          )}
        </Box.Stack>
      </Box>
    );
  };

  return (
    <Box css={styles.contentCol(flat)} style={{ marginLeft: depth * 0 * 4 }}>
      <Box.Flex
        css={cssObj({
          display: 'grid',
          gridTemplateColumns: 'auto 1fr',
          gridTemplateRows: 'repeat(5, auto)',
          width: '100%',
          marginBottom: '$2',
          columnGap: '$2',
          rowGap: '1px',
        })}
      >
        <Box.Flex justify={'flex-start'} align={'center'} css={styles.iconCol}>
          <Avatar.Generated
            role="img"
            size="sm"
            hash={operation.from.address}
            aria-label={operation.from.address}
          />
        </Box.Flex>
        <Box.Flex justify={'flex-start'} align={'center'} gap="$1" wrap="wrap">
          <Text as="span" fontSize="sm" css={styles.name}>
            {accountFrom?.name || 'Unknown'}
          </Text>
          {isFromContract && (
            <Box css={styles.badge}>
              <Text fontSize="sm" color="gray8">
                Contract
              </Text>
            </Box>
          )}
          <Text
            fontSize="sm"
            color="gray8"
            css={styles.address}
            aria-label={operation.from.address}
          >
            {shortAddress(fuelFromAddress)}
          </Text>
          <IconButton
            size="xs"
            variant="link"
            icon="Copy"
            aria-label="Copy address"
            onPress={() => navigator.clipboard.writeText(fuelFromAddress)}
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
          {getOperationType()}
        </Box.Flex>

        <Box.Flex justify={'center'}>
          <Box css={styles.spacer} />
        </Box.Flex>
        <Box>{shouldShowAssetAmount && renderAssets(assetsAmount)}</Box>

        <Box.Flex justify={'flex-start'} align={'center'} css={styles.iconCol}>
          <Avatar.Generated
            role="img"
            size="sm"
            hash={operation.to.address}
            aria-label={operation.to.address}
          />
        </Box.Flex>
        <Box.Flex justify={'flex-start'} align={'center'} gap="$1" wrap="wrap">
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
          <Text fontSize="sm" color="gray8" css={styles.address}>
            {shortAddress(fuelToAddress)}
          </Text>
          <IconButton
            size="xs"
            variant="link"
            icon="Copy"
            aria-label="Copy address"
            onPress={() => navigator.clipboard.writeText(fuelToAddress)}
          />
        </Box.Flex>
      </Box.Flex>
    </Box>
  );
}

const styles = {
  contentCol: (flat: boolean) =>
    cssObj({
      display: 'flex',
      backgroundColor: '$white',
      boxShadow: flat
        ? 'none'
        : '0px 2px 6px -1px #2020201A, 0px 0px 0px 1px #2020201F',
      flex: 1,
      padding: '14px 12px',
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
  }),
  address: cssObj({
    fontWeight: '$medium',
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
  assetNft: cssObj({
    padding: '$1 $2',
  }),
  asset: cssObj({
    alignItems: 'center',
    gap: '$2',
    marginTop: '$1',
  }),
};
