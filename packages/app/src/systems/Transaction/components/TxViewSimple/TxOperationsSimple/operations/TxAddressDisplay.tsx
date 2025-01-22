import { cssObj } from '@fuel-ui/css';
import { Avatar, Box, IconButton, Spinner, Text } from '@fuel-ui/react';
import { useAccounts } from '~/systems/Account';
import { shortAddress } from '~/systems/Core';

type TxAddressDisplayProps = {
  address: string;
  name?: string;
  image?: string;
  isLoading?: boolean;
  isContract?: boolean;
};

export function TxAddressDisplay({
  address,
  name,
  image,
  isLoading,
  isContract,
}: TxAddressDisplayProps) {
  const { accounts } = useAccounts();
  const account = accounts?.find(
    (acc) => acc.address.toLowerCase() === address.toLowerCase()
  );

  return (
    <Box.Flex css={styles.root}>
      <Box css={styles.iconCol}>
        {isLoading ? (
          <Spinner size={24} />
        ) : image ? (
          <Avatar src={image} size={24} name={name || 'Contract'} />
        ) : (
          <Avatar.Generated hash={address} size={24} />
        )}
      </Box>
      <Box.Flex gap="$2" css={styles.contentCol}>
        <Text as="span" fontSize="sm">
          {isLoading
            ? 'Loading...'
            : account?.name || name || shortAddress(address)}
        </Text>
        {isContract && (
          <Box css={styles.badge}>
            <Text fontSize="sm" color="gray8">
              Contract
            </Text>
          </Box>
        )}
        <IconButton
          size="xs"
          variant="link"
          icon="Copy"
          aria-label="Copy address"
          onPress={() => navigator.clipboard.writeText(address)}
        />
      </Box.Flex>
    </Box.Flex>
  );
}

const styles = {
  root: cssObj({
    display: 'flex',
    alignItems: 'flex-start',
    gap: '$3',
  }),
  iconCol: cssObj({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '24px',
    flexShrink: 0,
  }),
  contentCol: cssObj({
    display: 'flex',
    flex: 1,
  }),
  badge: cssObj({
    padding: '$1 $2',
    backgroundColor: '$gray3',
    borderRadius: '$md',
  }),
};
