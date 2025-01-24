import { cssObj } from '@fuel-ui/css';
import { Avatar, Box, IconButton, Text } from '@fuel-ui/react';
import { useAccounts } from '~/systems/Account';
import { shortAddress } from '~/systems/Core';

type TxAddressDisplayProps = {
  address: string;
  name?: string;
  image?: string;
  isContract?: boolean;
  label?: string;
};

export function TxAddressDisplay({
  address,
  name,
  image,
  isContract,
}: TxAddressDisplayProps) {
  const { accounts } = useAccounts();
  const account = accounts?.find(
    (acc) => acc.address.toLowerCase() === address.toLowerCase()
  );

  return (
    <Box.Flex css={styles.root}>
      <Box css={styles.iconCol}>
        {image ? (
          <Avatar src={image} size="sm" name={name || 'Contract'} />
        ) : (
          <Avatar.Generated
            role="img"
            size="sm"
            hash={address}
            aria-label={address}
          />
        )}
      </Box>
      <Box.Flex gap="$1" css={styles.contentCol}>
        <Text as="span" fontSize="sm" css={styles.name}>
          {account?.name || 'Unknown'}
        </Text>
        {isContract && (
          <Box css={styles.badge}>
            <Text fontSize="sm" color="gray8">
              Contract
            </Text>
          </Box>
        )}
        <Text fontSize="sm" color="gray8" css={styles.address}>
          {shortAddress(address)}
        </Text>
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
    alignItems: 'center',
    gap: '$1',
  }),
  iconCol: cssObj({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  }),
  contentCol: cssObj({
    display: 'flex',
    flex: 1,
  }),
  badge: cssObj({
    padding: '0 $1',
    backgroundColor: '$gray3',
    borderRadius: '$md',
  }),
  name: cssObj({
    fontWeight: '$semibold',
    color: '#202020',
  }),
  address: cssObj({
    fontWeight: '$medium',
    color: '#646464',
  }),
};
