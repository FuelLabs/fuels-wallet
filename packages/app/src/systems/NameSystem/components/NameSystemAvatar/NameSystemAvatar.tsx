import { cssObj } from '@fuel-ui/css';
import { Avatar, Box, type FlexProps, Icon, IconButton } from '@fuel-ui/react';

interface NameSystemAvatarProps
  extends Omit<FlexProps, 'onClick' | 'onSelect'> {
  resolver: string;
  onSelect?: (resolver: string) => void;
  onClear?: () => void;
  children: React.ReactNode;
}

export function NameSystemAvatar({
  resolver,
  onSelect,
  onClear,
  children,
  ...props
}: NameSystemAvatarProps) {
  return (
    <Box.Flex onClick={() => onSelect?.(resolver)} css={styles.root} {...props}>
      <Box.Flex css={styles.content}>
        <Avatar.Generated hash={resolver} size={20} />
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
