import type { ThemeUtilsCSS } from '@fuel-ui/css';
import { cssObj } from '@fuel-ui/css';
import { Box, Copyable, Flex, Icon, IconButton, Text } from '@fuel-ui/react';
import { Address, type B256Address, type Bech32Address, isB256 } from 'fuels';
import { useMemo } from 'react';
import { shortAddress } from '~/systems/Core';
import { useExplorerLink } from '../../hooks/useExplorerLink';

export type AddressProps = {
  address: B256Address | Bech32Address;
  canOpenExplorer?: boolean;
  css?: ThemeUtilsCSS;
};

export const FuelAddress = ({
  address,
  canOpenExplorer = false,
  css,
}: AddressProps) => {
  const account = useMemo<B256Address>(() => {
    if (isB256(address)) {
      return address;
    }

    return Address.fromDynamicInput(address).toB256();
  }, [address]);

  const { openExplorer, href } = useExplorerLink(account);

  return (
    <Box.Flex css={styles.root}>
      <Flex align="center" gap="$2">
        <Copyable value={account} css={styles.copyable} aria-label={account}>
          <Text className="address" css={css}>
            {shortAddress(account)}
          </Text>
        </Copyable>
        {href && canOpenExplorer && (
          <IconButton
            intent="base"
            tooltip="View on Explorer"
            onPress={openExplorer}
            variant="link"
            icon={<Icon icon="ExternalLink" size={16} />}
            aria-label="View"
          />
        )}
      </Flex>
    </Box.Flex>
  );
};

const styles = {
  root: cssObj({
    '.address_tooltip': cssObj({
      fontSize: '$sm',
      lineHeight: '$4',
      maxWidth: 125,
      textAlign: 'center',
      wordWrap: 'break-word',
    }),
    '.address': {
      userSelect: 'none',
    },
  }),
  copyable: cssObj({
    // to make sure we're using same text format, we just hide the copy icon but still use Copyable.
    '&[data-invalid-address="true"]': {
      '.fuel_copyable-icon': {
        display: 'none',
      },
    },
  }),
};
