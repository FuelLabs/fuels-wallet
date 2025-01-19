import { cssObj } from '@fuel-ui/css';
import { Box, ContentLoader, Icon } from '@fuel-ui/react';
import { useEffect, useRef, useState } from 'react';
import { shortAddress } from '~/systems/Core';

interface NFTImageProps {
  assetId: string;
  image: string | undefined;
}

export const NFTImage = ({ assetId, image }: NFTImageProps) => {
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

  if (image && !fallback) {
    return (
      <Box css={styles.item}>
        {isLoading && (
          <ContentLoader width="100%" height="100%" viewBox="0 0 22 22">
            <rect x="0" y="0" rx="0" ry="0" width="22" height="22" />
          </ContentLoader>
        )}
        <img
          ref={imgRef}
          src={image}
          alt={shortAddress(assetId)}
          data-loading={isLoading}
          onLoad={() => setLoading(false)}
          onError={() => {
            setFallback(true);
          }}
        />
      </Box>
    );
  }

  return (
    <Box css={styles.noImage}>
      <Icon icon={Icon.is('FileOff')} />
    </Box>
  );
};

const styles = {
  item: cssObj({
    aspectRatio: '1 / 1',
    borderRadius: '12px',
    overflow: 'hidden',

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
