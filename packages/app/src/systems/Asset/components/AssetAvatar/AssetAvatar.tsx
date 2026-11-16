import { Avatar } from '@fuel-wallet/ui';
import { memo } from 'react';

type AssetAvatarProps = {
  name?: string;
  src?: string;
  size?: number;
};

// @fuel-ui/react clones the Radix root on every render, which remounts the avatar
export const AssetAvatar = memo(function AssetAvatar({
  name,
  src,
  size,
}: AssetAvatarProps) {
  return (
    <Avatar
      name={name || ''}
      src={src}
      css={size ? { height: size, width: size } : undefined}
    />
  );
});
