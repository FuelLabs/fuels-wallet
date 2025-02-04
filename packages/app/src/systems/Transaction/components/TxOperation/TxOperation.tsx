import { cssObj } from '@fuel-ui/css';
import { Box, Icon, Text } from '@fuel-ui/react';
import type { AssetFuelAmount } from '@fuel-wallet/types';
import { useEffect, useState } from 'react';
import { AssetsCache } from '~/systems/Asset/cache/AssetsCache';
import { MotionBox, animations } from '~/systems/Core';
import { NetworkService } from '~/systems/Network/services/network';
import type { SimplifiedOperation } from '../../types';
import { TxOperationCard } from './TxOperationCard';

type TxOperationProps = {
  operation: SimplifiedOperation;
  showNesting?: boolean;
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
  // showNesting = true,
}: TxOperationProps) {
  const metadata = operation.metadata;
  // const isContract = operation.type === TxCategory.CONTRACTCALL;
  const depth = metadata?.depth || 0;
  const [assetsAmount, setAssetsAmount] = useState<AssetFuelAmount[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  useEffect(() => {
    fetchAssetsAmount(operation).then(setAssetsAmount);
  }, [operation]);

  // if (isContract && !showNesting && depth !== 0) return null;

  return (
    <Box.VStack grow={1}>
      <TxOperationCard
        operation={operation}
        assetsAmount={assetsAmount}
        depth={depth}
      />
      {metadata.operationCount && metadata.operationCount > 1 && (
        <MotionBox
          {...animations.fadeIn()}
          css={styles.operationCount}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <Icon
            icon={isExpanded ? 'ArrowsMinimize' : 'ArrowsMaximize'}
            size={20}
          />
          <Text fontSize="sm" color="gray12" as="span">
            {isExpanded ? 'Collapse' : 'Expand'}
          </Text>
          {isExpanded ? null : (
            <Text fontSize="sm" color="gray11" as="span">
              (+{metadata.operationCount} operations)
            </Text>
          )}
        </MotionBox>
      )}
      {isExpanded && (
        <MotionBox {...animations.slideInTop()} css={styles.expandedOperations}>
          {metadata.childOperations?.map((op, idx) => (
            <TxOperationCard
              key={`${op.type}-${op.from.address}-${op.to.address}-${idx}`}
              operation={op}
              assetsAmount={[]}
              depth={depth}
            />
          ))}
        </MotionBox>
      )}
    </Box.VStack>
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
  operationCount: {
    marginTop: '$2',
    marginLeft: '$2',
    display: 'flex',
    alignItems: 'center',
    gap: '$1',
    justifyContent: 'center',
    marginBottom: '$2',
    cursor: 'pointer',
  },
  expandedOperations: cssObj({
    display: 'flex',
    flexDirection: 'column',
    gap: '$1',
  }),
};
