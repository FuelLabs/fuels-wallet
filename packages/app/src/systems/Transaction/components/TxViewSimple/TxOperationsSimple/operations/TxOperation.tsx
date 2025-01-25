import { cssObj } from '@fuel-ui/css';
import {
  Avatar,
  Box,
  ContentLoader,
  Icon,
  IconButton,
  Text,
} from '@fuel-ui/react';
import type { AssetFuelAmount } from '@fuel-wallet/types';
import { useEffect, useState } from 'react';
import { useAccounts } from '~/systems/Account';
import { AssetsAmount } from '~/systems/Asset';
import { AssetsCache } from '~/systems/Asset/cache/AssetsCache';
import { shortAddress } from '~/systems/Core';
import { NetworkService } from '~/systems/Network/services/network';
import { TxCategory } from '../../../../types';
import type { SimplifiedOperation } from '../../../../types';

type TxOperationProps = {
  operation: SimplifiedOperation;
  showNesting?: boolean;
};

const SpacerComponent = () => {
  return <Box css={styles.spacer} />;
};

const AssetLoader = () => (
  <ContentLoader width={120} height={20}>
    <rect x="0" y="0" rx="4" ry="4" width="120" height="20" />
  </ContentLoader>
);

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
  const [isLoading, setIsLoading] = useState(false);

  const accountFrom = accounts?.find(
    (acc) => acc.address.toLowerCase() === operation.from.toLowerCase()
  );
  const accountTo = accounts?.find(
    (acc) => acc.address.toLowerCase() === operation.to.toLowerCase()
  );

  useEffect(() => {
    const fetchAssetsAmount = async () => {
      try {
        const coins = [];
        if (operation.amount && operation.assetId) {
          coins.push({
            amount: operation.amount,
            assetId: operation.assetId,
          });
        } else if (metadata?.amount && metadata?.assetId) {
          coins.push({
            amount: metadata.amount,
            assetId: metadata.assetId,
          });
        }

        if (!coins.length) return;

        setIsLoading(true);
        const assetsCache = AssetsCache.getInstance();
        const network = await NetworkService.getSelectedNetwork();
        if (!network) return;

        console.log('Fetching assets for:', coins);

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
        console.log('Setting assets:', filteredAssets);
        setAssetsAmount(filteredAssets);
      } catch (error) {
        console.error('Error fetching assets:', error);
        setAssetsAmount([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAssetsAmount();
  }, []); // Only run once when component mounts

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
    <Box.Flex css={styles.root}>
      <Box.Stack gap="$2" css={styles.contentCol}>
        <Box.Flex
          css={cssObj({
            display: 'grid',
            gridTemplateColumns: 'auto 1fr',
            gridTemplateRows: 'repeat(5, auto)',
            gap: '$2',
            width: '100%',
            marginBottom: '$2',
          })}
        >
          {/* From Address */}
          <Box.Flex justify={'flex-start'} align={'center'}>
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
            <SpacerComponent />
          </Box.Flex>
          <Box />
          <Box.Flex justify={'center'} align={'center'} css={styles.blue}>
            <Icon icon="CircleArrowDown" size={16} />
          </Box.Flex>
          <Box.Flex justify={'flex-start'} align={'center'} css={styles.blue}>
            {getOperationType()}
          </Box.Flex>

          {/* Asset Amount */}
          <Box.Flex justify={'center'}>
            <SpacerComponent />
          </Box.Flex>
          <Box>
            {shouldShowAssetAmount &&
              (isLoading ? (
                <AssetLoader />
              ) : assetsAmount.length > 0 ? (
                <AssetsAmount amounts={assetsAmount} />
              ) : null)}
          </Box>

          {/* To Address */}
          <Box.Flex justify={'flex-start'} align={'center'}>
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
      </Box.Stack>
    </Box.Flex>
  );
}
// we also have the operations not related to the account in a group, and intermediate contract calls
const styles = {
  root: cssObj({
    padding: '$1',
    backgroundColor: '#E0E0E0',
    borderRadius: '12px',
    width: '100%',
    boxSizing: 'border-box',
  }),
  contentCol: cssObj({
    display: 'flex',
    backgroundColor: 'white',
    boxShadow: '0px 2px 6px -1px #2020201A, 0px 0px 0px 1px #2020201F',
    flex: 1,
    borderRadius: '8px',
    minWidth: 0,
    padding: '$3',
  }),
  blue: cssObj({
    fontSize: '$sm',
    display: 'flex',
    alignItems: 'center',
    gap: '$1',
    color: '#0D74CE',
  }),
  functionName: cssObj({
    fontSize: '$sm',
    color: '$gray8',
  }),
  spacer: cssObj({
    borderLeft: '1px solid #D9D9D9',
    minHeight: '14px',
    width: '2px',
    height: '100%',
    backgroundColor: '#D9D9D9',
    borderRadius: '$lg',
  }),
  iconCol: cssObj({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  }),
  badge: cssObj({
    padding: '0 $1',
    backgroundColor: '$gray3',
    borderRadius: '$md',
  }),
  name: cssObj({
    fontWeight: '$semibold',
    color: '#202020',
  }),
  address: cssObj({
    fontWeight: '$medium',
    color: '#646464',
  }),
};
