import { Icon } from '@fuel-ui/react';
import { useState } from 'react';

interface DappAvatarProps {
  favIconUrl: string | undefined;
  title: string | undefined;
}

export const DappAvatar = ({ favIconUrl, title }: DappAvatarProps) => {
  const [imageFallback, setImageFallback] = useState(false);

  if (favIconUrl && !imageFallback) {
    return (
      <img
        src={favIconUrl}
        alt="favicon"
        onError={() => {
          setImageFallback(true);
        }}
      />
    );
  }

  if (title) {
    return <span>{title.substring(0, 1)}</span>;
  }

  return <Icon icon="World" color="intentsBase10" size={16} />;
};
