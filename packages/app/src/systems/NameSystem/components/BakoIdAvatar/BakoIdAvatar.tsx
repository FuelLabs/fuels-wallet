import { Avatar, type AvatarProps } from '@fuel-ui/react';
import Bako from '../../assets/svg/bako.svg';
import { memo } from 'react';

interface BakoIdAvatarProps extends Omit<AvatarProps, 'src'> {}

export const BakoIdAvatar = memo(
  ({ name, size, ...props }: BakoIdAvatarProps) => {
    return <Avatar name={name} src={Bako} size={size} {...props} />;
  }
);
