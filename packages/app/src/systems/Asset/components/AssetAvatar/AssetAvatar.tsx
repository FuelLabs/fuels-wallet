import { Avatar } from '@fuel-ui/react';
import { memo } from 'react';

export type AssetAvatarProps = {
  name?: string;
  src?: string;
  size?: number;
};

// @fuel-ui/react deep-merges props on every render, which clones the Radix
// Avatar root it passes as `as`. React then sees a new component type,
// remounts the avatar and shows the fallback until the image loads again.
// Memoizing on the primitive props skips those re-renders during polling.
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
