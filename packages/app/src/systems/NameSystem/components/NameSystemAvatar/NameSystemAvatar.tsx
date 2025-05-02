import { cssObj } from '@fuel-ui/css';
import {
  type AvatarProps,
  Box,
  type FlexProps,
  Icon,
  IconButton,
  useFuelTheme,
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
  const { current } = useFuelTheme();

  return (
    <Box.Flex onClick={() => onSelect?.(resolver)} css={styles.root} {...props}>
      <Box.Flex css={styles.content} data-theme={current}>
        <BakoIdAvatar name={resolver ?? ''} size={avatarSize} />
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
    height: '100%',
    justifyItens: 'space-between',

    '.fuel_Icon, .fuel_Icon:hover': {
      color: '$inputBaseIcon !important',
    },
  }),
  content: {
    flex: 1,
    gap: '$2',
    alignItems: 'center',
    '&[data-theme="light"] span': {
      backgroundColor: '$gray11',
    },
    '&[data-theme="dark"] span': {
      backgroundColor: '$gray2',
    },
  },
};
