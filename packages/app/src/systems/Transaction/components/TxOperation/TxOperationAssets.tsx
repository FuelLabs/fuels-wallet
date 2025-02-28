import { cssObj } from '@fuel-ui/css';
import { Avatar, Badge, Box, Image, Text } from '@fuel-ui/react';
import type { AssetFuelAmount } from '@fuel-wallet/types';
import type { AssetFuelData } from '@fuel-wallet/types';
import { bn } from 'fuels';
import { formatAmount } from '~/systems/Core';
import { convertToUsd } from '~/systems/Core/utils/convertToUsd';

type TxOperationAssetsProps = {
  amounts: AssetFuelAmount[];
  baseAsset?: AssetFuelData;
};

export function TxOperationAssets({
  amounts,
  baseAsset,
}: TxOperationAssetsProps) {
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

  const nonEmptyAmounts = amounts.filter((assetAmount) =>
    bn(assetAmount.amount).gt(0)
  );

  if (!nonEmptyAmounts.length) return null;

  return (
    <Box css={cssObj({ marginBottom: '$3' })}>
      <Box.Stack gap="$1">
        {nonEmptyAmounts.map((assetAmount) => (
          <Box.Flex css={styles.asset} key={assetAmount.assetId}>
            {getAssetImage(assetAmount)}
            <Box css={styles.amountContainer}>
              <Box.Flex direction="column">
                <Box.Flex gap="$2" align="center">
                  <Text
                    as="span"
                    className="amount-value"
                    aria-label="amount-container"
                  >
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
        ))}
      </Box.Stack>
    </Box>
  );
}

const styles = {
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
    padding: '$0 $1',
  }),
  asset: cssObj({
    alignItems: 'center',
    gap: '$2',
    marginTop: '$1',
    minHeight: '24px',
  }),
};
