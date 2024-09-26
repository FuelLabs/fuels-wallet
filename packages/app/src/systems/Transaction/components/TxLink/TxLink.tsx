import { cssObj } from '@fuel-ui/css';
import { Link } from '@fuel-ui/react';
import { useExplorerLink } from '../../hooks/useExplorerLink';

export type TxLinkProps = {
  txHash?: string;
};

export function TxLink({ txHash }: TxLinkProps) {
  const { openExplorer, enabled } = useExplorerLink(txHash);

  if (!enabled) return null;

  return (
    <Link css={styles.root} isExternal onClick={() => openExplorer()}>
      Click here to view on Fuel Explorer
    </Link>
  );
}

const styles = {
  root: cssObj({
    textSize: 'sm',
  }),
};
