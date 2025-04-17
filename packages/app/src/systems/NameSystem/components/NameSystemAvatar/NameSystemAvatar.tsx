import { cssObj } from '@fuel-ui/css';
import {
  type AvatarProps,
  Box,
  type FlexProps,
  Icon,
  IconButton,
} from '@fuel-ui/react';
import { BakoIdAvatar } from '../BakoIdAvatar';

interface NameSystemAvatarProps
  extends Omit<FlexProps, 'onClick' | 'onSelect'> {
  resolver: string;
  onSelect?: (resolver: string) => void;
  onClear?: () => void;
  children: React.ReactNode;
  avatarSize?: AvatarProps['size'];
}

export function NameSystemAvatar({
  resolver,
  onSelect,
  onClear,
  children,
  avatarSize = 'sm',
  ...props
}: NameSystemAvatarProps) {
  return (
    <Box.Flex onClick={() => onSelect?.(resolver)} css={styles.root} {...props}>
      <Box.Flex css={styles.content}>
        <BakoIdAvatar name={resolver} size={avatarSize} />
        {children}
      </Box.Flex>
      {onClear && (
        <IconButton
          variant="link"
          aria-label="Clear"
          icon={Icon.is('X')}
          onPress={onClear}
        />
      )}
    </Box.Flex>
  );
}

const styles = {
  root: cssObj({
    flex: 1,
    width: '100%',
    justifyItens: 'space-between',

    '.fuel_Icon, .fuel_Icon:hover': {
      color: '$inputBaseIcon !important',
    },
  }),
  content: {
    flex: 1,
    gap: '$2',
    alignItems: 'center',
  },
};
