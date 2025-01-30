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
import type { AssetFuelAmount } from '@fuel-wallet/types';
import { bn } from 'fuels';
import { useEffect, useState } from 'react';
import { useAccounts } from '~/systems/Account';
import { AssetsCache } from '~/systems/Asset/cache/AssetsCache';
import { shortAddress } from '~/systems/Core';
import { formatAmount } from '~/systems/Core';
import { NetworkService } from '~/systems/Network/services/network';
import { TxCategory } from '../../../../types';
import type { SimplifiedOperation } from '../../../../types';

type TxOperationProps = {
  operation: SimplifiedOperation;
  showNesting?: boolean;
};

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
                  <Text as="span" className="amount-value">
                    {formatAmount({
                      amount: assetAmount.amount,
                      options: {
                        units: assetAmount.decimals || 0,
                        precision: assetAmount.decimals || 0,
                      },
                    })}
                  </Text>
                  <Text as="span">{assetAmount.symbol}</Text>
                  {assetAmount.isNft && (
                    <Badge
                      variant="ghost"
                      intent="primary"
                      css={styles.assetNft}
                    >
                      NFT
                    </Badge>
                  )}
                </Box>
              </Box.Flex>
            )
        )}
      </Box.Stack>
    </Box>
  );
};

const fetchAssetsAmount = async (operation: SimplifiedOperation) => {
  try {
    const coins = [];
    if (operation.amount && operation.assetId) {
      coins.push({
        amount: operation.amount,
        assetId: operation.assetId,
      });
    } else if (operation.metadata?.amount && operation.metadata?.assetId) {
      coins.push({
        amount: operation.metadata.amount,
        assetId: operation.metadata.assetId,
      });
    }

    if (!coins.length) return [];

    const assetsCache = AssetsCache.getInstance();
    const network = await NetworkService.getSelectedNetwork();
    if (!network) return [];

    const assetsWithAmount = await Promise.all(
      coins.map(async (operationCoin) => {
        const assetCached = await assetsCache.getAsset({
          chainId: network.chainId,
          assetId: operationCoin.assetId,
          dbAssets: [],
          save: false,
        });

        if (!assetCached) return null;

        return {
          type: 'fuel',
          chainId: network.chainId,
          name: assetCached.name,
          symbol: assetCached.symbol,
          decimals: assetCached.decimals,
          icon: assetCached.icon,
          assetId: operationCoin.assetId,
          amount: operationCoin.amount,
        } as AssetFuelAmount;
      })
    );

    const filteredAssets = assetsWithAmount.filter(
      (a): a is AssetFuelAmount => a !== null
    );
    return filteredAssets;
  } catch (error) {
    console.error('Error fetching assets:', error);
    return [];
  }
};

export function TxOperation({
  operation,
  showNesting = true,
}: TxOperationProps) {
  const metadata = operation.metadata;
  const isContract = operation.type === TxCategory.CONTRACTCALL;
  const isTransfer = operation.type === TxCategory.SEND;
  const depth = metadata?.depth || 0;
  const { accounts } = useAccounts();
  const [assetsAmount, setAssetsAmount] = useState<AssetFuelAmount[]>([]);

  const accountFrom = accounts?.find(
    (acc) => acc.address.toLowerCase() === operation.from.toLowerCase()
  );
  const accountTo = accounts?.find(
    (acc) => acc.address.toLowerCase() === operation.to.toLowerCase()
  );

  useEffect(() => {
    fetchAssetsAmount(operation).then(setAssetsAmount);
  }, [operation]);

  const getOperationType = () => {
    if (isContract) return 'Calls contract (sending funds)';
    if (isTransfer) return 'Sends token';
    return 'Unknown';
  };

  // For transfers, always show with 0 indentation
  // For contract calls, only show if root level (depth === 0) unless showNesting is true
  if (isContract && !showNesting && depth !== 0) return null;

  const shouldShowAssetAmount =
    (operation.amount && operation.assetId) ||
    (metadata?.amount && metadata?.assetId);

  return (
    <Box css={styles.contentCol}>
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
            hash={operation.from}
            aria-label={operation.from}
          />
        </Box.Flex>
        <Box.Flex gap="$1" justify={'flex-start'} align={'center'}>
          <Text as="span" fontSize="sm" css={styles.name}>
            {accountFrom?.name || 'Unknown'}
          </Text>
          {isContract && (
            <Box css={styles.badge}>
              <Text fontSize="sm" color="gray8">
                Contract
              </Text>
            </Box>
          )}
          <Text fontSize="sm" color="gray8" css={styles.address}>
            {shortAddress(operation.from)}
          </Text>
          <IconButton
            size="xs"
            variant="link"
            icon="Copy"
            aria-label="Copy address"
            onPress={() => navigator.clipboard.writeText(operation.from)}
          />
        </Box.Flex>

        {/* Spacer and Arrow */}
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

        {/* Asset Amount */}
        <Box.Flex justify={'center'}>
          <Box css={styles.spacer} />
        </Box.Flex>
        <Box>
          {shouldShowAssetAmount &&
            assetsAmount.length > 0 &&
            renderAssets(assetsAmount)}
        </Box>

        {/* To Address */}
        <Box.Flex justify={'flex-start'} align={'center'} css={styles.iconCol}>
          <Avatar.Generated
            role="img"
            size="sm"
            hash={operation.to}
            aria-label={operation.to}
          />
        </Box.Flex>
        <Box.Flex justify={'flex-start'} align={'center'} gap="$1">
          <Text as="span" fontSize="sm" css={styles.name}>
            {accountTo?.name || 'Unknown'}
          </Text>
          {isContract && (
            <Box css={styles.badge}>
              <Text fontSize="sm" color="gray8">
                Contract
              </Text>
            </Box>
          )}
          <Text fontSize="sm" color="gray8" css={styles.address}>
            {shortAddress(operation.to)}
          </Text>
          <IconButton
            size="xs"
            variant="link"
            icon="Copy"
            aria-label="Copy address"
            onPress={() => navigator.clipboard.writeText(operation.to)}
          />
        </Box.Flex>
      </Box.Flex>
    </Box>
  );
}

const styles = {
  contentCol: cssObj({
    display: 'flex',
    backgroundColor: '$gray1',
    boxShadow: '0px 2px 6px -1px $colors$gray4, 0px 0px 0px 1px $colors$gray6',
    flex: 1,
    borderRadius: '8px',
    minWidth: 0,
    padding: '14px 12px',
    margin: '0 4px',
  }),
  blue: cssObj({
    fontSize: '$sm',
    display: 'flex',
    alignItems: 'center',
    gap: '$1',
    color: '$indigo11',
    lineHeight: 'normal',
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
    padding: '0 $1',
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
  asset: {
    alignItems: 'center',
    gap: '$2',
    marginTop: '$1',
  },
  assetNft: {
    padding: '$1 $2',
  },
  amountContainer: {
    fontWeight: '$semibold',
    color: '$gray12',
    fontSize: '$sm',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
};
