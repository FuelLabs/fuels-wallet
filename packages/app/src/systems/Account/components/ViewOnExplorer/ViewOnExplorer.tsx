import { cssObj } from '@fuel-ui/css';
import { HStack, Icon } from '@fuel-ui/react';
import type { B256Address } from 'fuels';
import { useExplorerLink } from '../../hooks/useExplorerLink';

export type ViewOnExplorerProps = {
  address: B256Address;
};

export const ViewOnExplorer = ({ address }: ViewOnExplorerProps) => {
  const { openExplorer } = useExplorerLink(address);

  return (
    <HStack align="center" gap="$2" css={styles.root} onClick={openExplorer}>
      View on Explorer
      <Icon
        css={styles.icon}
        icon={Icon.is('ExternalLink')}
        size={10}
        aria-label="View on Explorer"
      />
    </HStack>
  );
};

const styles = {
  root: cssObj({
    cursor: 'pointer',
    textDecoration: 'none',
    fontWeight: '$normal',
    lineHeight: '$4',
    fontSize: '$xs',
    userSelect: 'none',
    color: '$intentsBase11',
    transition: 'color 0.2s ease-in-out',

    '&:hover': {
      color: '$intentsBase12',
      textDecoration: 'underline',
    },
  }),
  icon: cssObj({
    width: 16,
    height: 16,
  }),
};
