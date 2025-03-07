import { cssObj } from '@fuel-ui/css';
import { Avatar, Badge, Box, Icon, Image, Text } from '@fuel-ui/react';
import type { AssetFuelAmount } from '@fuel-wallet/types';
import type { AssetFuelData } from '@fuel-wallet/types';
import { bn } from 'fuels';
import { useEffect, useRef, useState } from 'react';
import { formatAmount, shortAddress } from '~/systems/Core';
import { convertToUsd } from '~/systems/Core/utils/convertToUsd';

type TxOperationAssetsProps = {
  amounts: AssetFuelAmount[];
  baseAsset?: AssetFuelData;
};

function TxNFTImage({ assetId, image }: { assetId: string; image: string }) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    if (imgRef.current?.complete) {
      if (imgRef.current.naturalWidth) {
        return;
      }
      setFallback(true);
    }
  }, []);

  if (!image || fallback) {
    return (
      <Box css={styles.emptyNFT}>
        <Icon icon={Icon.is('FileOff')} size={16} />
      </Box>
    );
  }

  return (
    <Box css={styles.nftImageWrapper}>
      <Image
        ref={imgRef}
        src={image}
        alt={shortAddress(assetId)}
        css={{ width: '100%', height: '100%', objectFit: 'cover' }}
        onError={() => setFallback(true)}
      />
    </Box>
  );
}

export function TxOperationAssets({
  amounts,
  baseAsset,
}: TxOperationAssetsProps) {
  const getAssetImage = (asset: AssetFuelAmount) => {
    if (asset.isNft && asset.metadata?.image) {
      return (
        <Box css={styles.nftImageContainer}>
          <TxNFTImage assetId={asset.assetId} image={asset.metadata.image} />
        </Box>
      );
    }

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
                    {!assetAmount.isNft ? (
                      <>
                        {formatAmount({
                          amount: assetAmount.amount,
                          options: {
                            units: assetAmount.decimals || 0,
                            precision: assetAmount.decimals || 0,
                          },
                        })}
                        {assetAmount.symbol || 'Unknown'}
                      </>
                    ) : (
                      <Text as="span" className="nft-name">
                        {assetAmount.metadata?.name}
                      </Text>
                    )}
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
  nftImageContainer: cssObj({
    width: '35px',
    height: '35px',
    display: 'flex',
    overflow: 'hidden',
    borderRadius: '$md',
    alignItems: 'center',
    boxSizing: 'border-box',
    justifyContent: 'center',
    backgroundColor: '$gray6',
    border: '1.5px solid $cardBg',
  }),
  nftImageWrapper: cssObj({
    width: '100%',
    height: '100%',
  }),
  emptyNFT: cssObj({
    width: '40px',
    height: '40px',
    borderRadius: '8px',
    border: '1px solid $cardBorder',
    backgroundColor: '$cardBg',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: '$gray9',
  }),
};
