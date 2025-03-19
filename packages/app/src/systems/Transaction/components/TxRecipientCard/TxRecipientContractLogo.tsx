import { cssObj } from '@fuel-ui/css';
import { Icon, Image } from '@fuel-ui/react';
import { useEffect, useRef, useState } from 'react';
import { getProjectImage } from '~/systems/Ecosystem/utils/getProjectImage';

type TxRecipientContractLogoProps = {
  name?: string;
  image?: string;
  size?: number;
};

export function TxRecipientContractLogo({
  name,
  image,
  size = 20,
}: TxRecipientContractLogoProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [imageFallback, setImageFallback] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);

  useEffect(() => {
    if (imgRef.current?.complete) {
      if (imgRef.current.naturalWidth) {
        setIsImageLoading(false);
        return;
      }

      setImageFallback(true);
    }
  }, []);

  if (image && !imageFallback) {
    return (
      <Image
        ref={imgRef}
        src={getProjectImage(image)}
        alt={name}
        width={size}
        height={size}
        css={styles.avatar}
        data-hidden={isImageLoading}
        onLoad={() => setIsImageLoading(false)}
        onError={() => {
          setImageFallback(true);
        }}
      />
    );
  }

  return <Icon icon={Icon.is('Code')} size={20} />;
}

const styles = {
  avatar: cssObj({
    '&[data-hidden="true"]': {
      display: 'none',
    },
  }),
};
