import { cssObj } from '@fuel-ui/css';
import { Avatar, Box, Icon, Image, Text, Tooltip } from '@fuel-ui/react';
import type { AssetFuelAmount } from '@fuel-wallet/types';
import { bn } from 'fuels';
import { useEffect, useRef, useState } from 'react';
import { formatAmount, shortAddress } from '~/systems/Core';
import { MotionBox } from '~/systems/Core/components/Motion';
import { convertToUsd } from '~/systems/Core/utils/convertToUsd';
import type { AssetAmountWithRate } from '../../types';

type TxOperationAssetsProps = {
  amounts: (AssetFuelAmount | AssetAmountWithRate)[];
  baseAsset?: AssetFuelAmount;
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
        src={image.replace('ipfs://', 'https://ipfs.io/ipfs/')}
        alt={shortAddress(assetId)}
        css={{ width: '100%', height: '100%', objectFit: 'cover' }}
        onError={() => setFallback(true)}
      />
    </Box>
  );
}

export function TxOperationAssets({ amounts }: TxOperationAssetsProps) {
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

  const renderAmount = (assetAmount: AssetFuelAmount | AssetAmountWithRate) => {
    if (assetAmount.isNft) {
      return (
        <Text as="span" className="nft-name">
          {assetAmount.metadata?.name ||
            `NFT ${shortAddress(assetAmount.assetId)}`}
        </Text>
      );
    }

    const formattedAmount =
      (assetAmount as AssetAmountWithRate).formattedAmount ||
      formatAmount({
        amount: assetAmount.amount,
        options: {
          units: assetAmount.decimals || 0,
          precision: Math.min(assetAmount.decimals || 0, 3),
        },
      });

    const fullFormattedAmount =
      (assetAmount as AssetAmountWithRate).fullFormattedAmount ||
      formatAmount({
        amount: assetAmount.amount,
        options: {
          units: assetAmount.decimals || 0,
          precision: assetAmount.decimals || 0,
        },
      });

    return (
      <>
        {fullFormattedAmount !== formattedAmount ? (
          <Tooltip content={fullFormattedAmount} delayDuration={0}>
            <Text as="span">
              {formattedAmount} {assetAmount.symbol || 'Unknown'}
            </Text>
          </Tooltip>
        ) : (
          <Text as="span">
            {formattedAmount} {assetAmount.symbol || 'Unknown'}
          </Text>
        )}
      </>
    );
  };

  const renderUsdValue = (
    assetAmount: AssetFuelAmount | AssetAmountWithRate
  ) => {
    if (assetAmount.isNft) return null;

    const usdValue =
      (assetAmount as AssetAmountWithRate).formattedUsd ||
      (assetAmount.rate &&
        convertToUsd(
          bn(assetAmount.amount),
          assetAmount.decimals,
          assetAmount.rate as number
        ).formatted);

    if (!usdValue) return null;

    return <Text color="textSubtext">({usdValue})</Text>;
  };

  return (
    <MotionBox
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      css={cssObj({ marginBottom: '$3', overflow: 'hidden' })}
    >
      <Box.Stack gap="$1">
        {nonEmptyAmounts.map((assetAmount) => (
          <Box.Flex css={styles.asset} key={assetAmount.assetId}>
            {getAssetImage(assetAmount as AssetFuelAmount)}
            <Box css={styles.amountContainer}>
              <Box.Flex direction="column">
                <Box.Flex gap="$0 $2" align="center" wrap="wrap">
                  <Text
                    as="span"
                    color="textHeading"
                    aria-label="amount-container"
                  >
                    {renderAmount(assetAmount)}
                  </Text>
                  {renderUsdValue(assetAmount)}
                </Box.Flex>
              </Box.Flex>
            </Box>
          </Box.Flex>
        ))}
      </Box.Stack>
    </MotionBox>
  );
}

const styles = {
  amountContainer: cssObj({
    fontWeight: '$semibold',
    color: '$textHeading',
    fontSize: '$sm',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: 'flex',
    flexDirection: 'column',
    gap: '$1',

    '.fuel_Tooltip': {
      display: 'inline-block',
    },
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
