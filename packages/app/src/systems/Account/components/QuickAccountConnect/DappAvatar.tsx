import { Icon } from '@fuel-ui/react';

interface DappAvatarProps {
  favIconUrl: string | undefined;
  title: string | undefined;
}

export const DappAvatar = ({ favIconUrl, title }: DappAvatarProps) => {
  if (favIconUrl) {
    return <img src={favIconUrl} alt="favicon" />;
  }

  if (title) {
    return <span>{title.substring(0, 1)}</span>;
  }

  return <Icon icon="World" color="intentsBase10" size={16} />;
};
