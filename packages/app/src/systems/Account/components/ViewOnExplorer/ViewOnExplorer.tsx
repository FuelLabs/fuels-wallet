import { cssObj } from '@fuel-ui/css';
import { HStack, Icon } from '@fuel-ui/react';
import { Address, type B256Address, type Bech32Address, isB256 } from 'fuels';
import { useMemo } from 'react';
import { useExplorerLink } from '../../hooks/useExplorerLink';

export type ViewOnExplorerProps = {
  address: B256Address | Bech32Address;
};

export const ViewOnExplorer = ({ address }: ViewOnExplorerProps) => {
  const account = useMemo<B256Address>(() => {
    if (isB256(address)) {
      return address;
    }

    return Address.fromDynamicInput(address).toB256();
  }, [address]);

  const { openExplorer } = useExplorerLink(account);

  return (
    <HStack align="center" gap="$2" css={styles.root} onClick={openExplorer}>
      View on Explorer
      <Icon icon={Icon.is('ExternalLink')} aria-label="View on Explorer" />
    </HStack>
  );
};

const styles = {
  root: cssObj({
    cursor: 'pointer',
    textDecoration: 'none',
    fontWeight: '$normal',
    fontSize: '$xs',
    userSelect: 'none',
    color: '$intentsBase11',
    transition: 'color 0.2s ease-in-out',

    '&:hover': {
      color: '$intentsBase12',
      textDecoration: 'underline',
    },
  }),
};
