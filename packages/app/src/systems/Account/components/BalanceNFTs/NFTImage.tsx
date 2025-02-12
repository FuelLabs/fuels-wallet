import { cssObj } from '@fuel-ui/css';
import { Box, ContentLoader, Icon, Image } from '@fuel-ui/react';
import { memo, useEffect, useRef, useState } from 'react';
import { NFTImageLoading } from '~/systems/Account/components/BalanceNFTs/NFTImageLoading';
import { shortAddress } from '~/systems/Core';

interface NFTImageProps {
  assetId: string;
  image: string | undefined;
}

function Empty() {
  return (
    <Box css={styles.noImage}>
      <Icon icon={Icon.is('FileOff')} />
    </Box>
  );
}

const _NFTImage = ({ assetId, image }: NFTImageProps) => {
  const imgRef = useRef<HTMLImageElement>(null);

  const [fallback, setFallback] = useState(false);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    if (imgRef.current?.complete) {
      if (imgRef.current.naturalWidth) {
        setLoading(false);
        return;
      }

      setFallback(true);
    }
  }, []);

  if (!image || !!fallback) return <Empty />;

  return (
    <Box css={styles.item}>
      {image && !fallback && isLoading && <NFTImageLoading />}
      {image && !fallback && (
        <Image
          ref={imgRef}
          src={image}
          alt={shortAddress(assetId)}
          data-loading={isLoading}
          style={cssObj({ visibility: isLoading ? 'hidden' : 'visible' })}
          onLoad={() => setLoading(false)}
          onError={() => setFallback(true)}
        />
      )}
    </Box>
  );
};

const styles = {
  item: cssObj({
    aspectRatio: '1 / 1',
    borderRadius: '12px',
    overflow: 'hidden',
    minHeight: '89px',
    img: {
      width: '100%',
      objectFit: 'cover',
    },
    'img[data-loading="true"]': {
      display: 'none',
    },
  }),
  noImage: cssObj({
    width: '100%',
    aspectRatio: '1 / 1',
    borderRadius: '12px',
    border: '1px solid $cardBorder',
    backgroundColor: '$cardBg',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  }),
};

export const NFTImage = memo(_NFTImage, (a, b) => {
  return a.assetId === b.assetId && a.image === b.image;
});
