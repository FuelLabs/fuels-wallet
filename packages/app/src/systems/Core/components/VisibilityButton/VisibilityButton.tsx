import type { IconButtonProps } from '@fuel-ui/react';
import { Icon, IconButton } from '@fuel-ui/react';

export type VisibilityButtonProps = Omit<IconButtonProps, 'icon'> & {
  isHidden?: boolean;
  onHide?: () => void;
  onShow?: () => void;
};

export function VisibilityButton({
  isHidden,
  onHide,
  onShow,
  ...props
}: VisibilityButtonProps) {
  return (
    <IconButton
      {...props}
      onPress={isHidden ? onShow : onHide}
      size="xs"
      variant="link"
      color="gray"
      icon={
        <Icon
          size={18}
          {...(isHidden
            ? {
                color: 'accent9',
                icon: 'EyeSlash',
              }
            : {
                color: 'gray8',
                icon: 'Eye',
              })}
        />
      }
    />
  );
}
