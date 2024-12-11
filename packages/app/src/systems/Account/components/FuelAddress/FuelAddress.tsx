import type { ThemeUtilsCSS } from '@fuel-ui/css';
import { cssObj } from '@fuel-ui/css';
import { Box, Copyable, Icon, IconButton, Text } from '@fuel-ui/react';
import {
  Address,
  type B256Address,
  type Bech32Address,
  type ChecksumAddress,
} from 'fuels';
import { useMemo } from 'react';
import { shortAddress } from '~/systems/Core';
import { useExplorerLink } from '../../hooks/useExplorerLink';

export type AddressProps = {
  address: ChecksumAddress | Bech32Address | B256Address;
  canOpenExplorer?: boolean;
  css?: ThemeUtilsCSS;
  isContract?: boolean;
};

export const FuelAddress = ({
  address,
  isContract,
  canOpenExplorer = false,
  css,
}: AddressProps) => {
  const account = useMemo<string>(() => {
    if (!address) return '';
    if (isContract) return Address.fromDynamicInput(address).toB256();
    return Address.fromDynamicInput(address).toString();
  }, [isContract, address]);

  const { openExplorer, href } = useExplorerLink(account);

  return (
    <Box.Flex align="center" gap="$0" css={styles.root}>
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
