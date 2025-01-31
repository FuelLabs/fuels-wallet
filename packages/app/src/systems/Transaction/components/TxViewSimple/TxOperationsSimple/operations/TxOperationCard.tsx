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
import { useAccounts } from '~/systems/Account';
import { formatAmount, shortAddress } from '~/systems/Core';
import type { SimplifiedOperation } from '../../../../types';
import { TxCategory } from '../../../../types';

type TxOperationCardProps = {
  operation: SimplifiedOperation;
  assetsAmount: AssetFuelAmount[];
  depth: number;
};

export function TxOperationCard({
  operation,
  assetsAmount,
  depth,
}: TxOperationCardProps) {
  const { accounts } = useAccounts();
  const isContract = operation.type === TxCategory.CONTRACTCALL;
  const isTransfer = operation.type === TxCategory.SEND;

  const accountFrom = accounts?.find(
    (acc) => acc.address.toLowerCase() === operation.from.address.toLowerCase()
  );
  const accountTo = accounts?.find(
    (acc) => acc.address.toLowerCase() === operation.to.address.toLowerCase()
  );

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

  const shouldShowAssetAmount =
    (operation.amount && operation.assetId) ||
    (operation.metadata?.amount && operation.metadata?.assetId);

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

  return (
    <Box css={styles.contentCol} style={{ marginLeft: depth * 4 }}>
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
          <Text fontSize="sm" color="gray8" css={styles.address}>
            {shortAddress(operation.from.address)}
          </Text>
          <IconButton
            size="xs"
            variant="link"
            icon="Copy"
            aria-label="Copy address"
            onPress={() =>
              navigator.clipboard.writeText(operation.from.address)
            }
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
        <Box>
          {shouldShowAssetAmount &&
            assetsAmount.length > 0 &&
            renderAssets(assetsAmount)}
        </Box>

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
            {shortAddress(operation.to.address)}
          </Text>
          <IconButton
            size="xs"
            variant="link"
            icon="Copy"
            aria-label="Copy address"
            onPress={() => navigator.clipboard.writeText(operation.to.address)}
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
    color: '$indigo11',
    lineHeight: 'normal',
  }),
  amountContainer: cssObj({
    fontWeight: '$semibold',
    color: '$gray12',
    fontSize: '$sm',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
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
