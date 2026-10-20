import type { ThemeUtilsCSS } from '@fuel-ui/css';
import { cssObj } from '@fuel-ui/css';
import { Box, Copyable, Icon, IconButton, Text } from '@fuel-ui/react';
import { Address, type B256Address, type ChecksumAddress } from 'fuels';
import { useMemo } from 'react';
import { highlightText, shortAddress } from '~/systems/Core';
import { useExplorerLink } from '../../hooks/useExplorerLink';

export type AddressProps = {
  address: string;
  canOpenExplorer?: boolean;
  css?: ThemeUtilsCSS;
  searchQuery?: string;
  isContract?: boolean;
};

export const FuelAddress = ({
  address,
  canOpenExplorer = false,
  css,
  searchQuery,
  isContract,
}: AddressProps) => {
  const account = useMemo<string>(() => {
    if (!address) return '';
    const fuelAddress = Address.fromDynamicInput(address);
    if (isContract) return fuelAddress.toB256();
    return fuelAddress.toString();
  }, [isContract, address]);

  const { openExplorer, href } = useExplorerLink(account);

  const displayAddress = useMemo(() => {
    const short = shortAddress(account);
    if (searchQuery) {
      const normalizedQuery = searchQuery.replace(/^0x/i, '');
      return highlightText(short, normalizedQuery);
    }
    return short;
  }, [account, searchQuery]);

  return (
    <Box.Flex align="center" gap="$0" css={styles.root}>
      <Copyable value={account} css={styles.copyable} aria-label={account}>
        <Text className="address" css={css}>
          {displayAddress}
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
