import { cssObj } from '@fuel-ui/css';
import {
  Avatar,
  Badge,
  Box,
  ContentLoader,
  Copyable,
  Grid,
  Icon,
  IconButton,
  Text,
  Tooltip,
} from '@fuel-ui/react';
import type { AssetFuelAmount } from '@fuel-wallet/types';
import { bn } from 'fuels';
import { useEffect, useRef, useState } from 'react';
import { useAccounts } from '~/systems/Account';
import { AssetsAmount } from '~/systems/Asset';
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

const SpacerComponent = () => {
  return <Box css={styles.spacer} />;
};

const AssetLoader = () => (
  <ContentLoader width={120} height={20}>
    <rect x="0" y="0" rx="4" ry="4" width="120" height="20" />
  </ContentLoader>
);

type AssetsAmountProps = {
  amounts: AssetFuelAmount[];
};

const TxAssetsAmount = ({ amounts }: AssetsAmountProps) => {
  const allEmptyAmounts = amounts.every((assetAmount) =>
    bn(assetAmount.amount).eq(0)
  );

  return (
    <>
      {!allEmptyAmounts && (
        <Box css={cssObj({ marginBottom: '$3' })}>
          <Box.Stack gap="$1">
            {amounts.map(
              (assetAmount) =>
                bn(assetAmount.amount).gt(0) && (
                  <TxAssetsAmountItem
                    assetAmount={assetAmount}
                    key={assetAmount.name}
                  />
                )
            )}
          </Box.Stack>
        </Box>
      )}
    </>
  );
};

type AssetsAmountItemProps = {
  assetAmount: AssetFuelAmount;
};

const TxAssetsAmountItem = ({ assetAmount }: AssetsAmountItemProps) => {
  const {
    name = '',
    symbol,
    icon,
    assetId,
    decimals,
    amount,
    isNft,
  } = assetAmount || {};

  const containerRef = useRef<HTMLDivElement>(null);
  const [isTruncated, setIsTruncated] = useState(false);

  const formatted = formatAmount({
    amount,
    options: { units: decimals || 0, precision: decimals || 0 },
  });

  useEffect(() => {
    if (containerRef.current) {
      const amountElement = containerRef.current.querySelector('.amount-value');
      if (amountElement) {
        setIsTruncated(amountElement.scrollWidth > amountElement.clientWidth);
      }
    }
  }, []);

  return (
    <Box.Flex css={styles.asset} key={assetId}>
      {icon ? (
        <Avatar name={name} src={icon} size="xsm" />
      ) : (
        <Avatar.Generated hash={assetId} size="xsm" />
      )}
      <Box css={styles.amountContainer}>
        <Tooltip
          content={formatted}
          delayDuration={0}
          open={isTruncated ? undefined : false}
        >
          <Text as="span" className="amount-value">
            {formatted}
          </Text>
        </Tooltip>
        <Text as="span">{symbol}</Text>
        {isNft && (
          <Badge variant="ghost" intent="primary" css={styles.assetNft}>
            NFT
          </Badge>
        )}
      </Box>
    </Box.Flex>
  );
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
          {/* From Address */}
          <Box.Flex
            justify={'flex-start'}
            align={'center'}
            css={styles.iconCol}
          >
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
            <Icon icon="CircleArrowDown" size={20} />
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
                <TxAssetsAmount amounts={assetsAmount} />
              ) : null)}
          </Box>

          {/* To Address */}
          <Box.Flex
            justify={'flex-start'}
            align={'center'}
            css={styles.iconCol}
          >
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
    padding: '14px 12px',
  }),
  blue: cssObj({
    fontSize: '$sm',
    display: 'flex',
    alignItems: 'center',
    gap: '$1',
    color: '#0D74CE',
    lineHeight: 'normal',
  }),
  functionName: cssObj({
    fontSize: '$sm',
    color: '$gray8',
  }),
  spacer: cssObj({
    minHeight: '14px',
    width: '2px',
    height: '100%',
    backgroundColor: '#D9D9D9',
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
    color: '#202020',
  }),
  address: cssObj({
    fontWeight: '$medium',
    color: '#646464',
  }),
  header: {
    alignItems: 'center',
    gap: '$2',
    mb: '$3',
  },
  title: {
    fontSize: '$sm',
    margin: 0,
  },
  asset: {
    alignItems: 'center',
    gap: '$2',
  },
  assetNft: {
    padding: '$1 $2',
  },
  amountContainer: {
    fontWeight: '$semibold',
    color: '#202020',
    fontSize: '$sm',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
};
