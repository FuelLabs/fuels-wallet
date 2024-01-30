import { cssObj } from '@fuel-ui/css';
import { Link } from '@fuel-ui/react';
import { buildBlockExplorerUrl } from 'fuels';

export type TxLinkProps = {
  txHash?: string;
  providerUrl?: string;
};

export function TxLink({ txHash, providerUrl }: TxLinkProps) {
  return (
    <Link
      css={styles.root}
      isExternal
      href={buildBlockExplorerUrl({
        txId: txHash,
        providerUrl,
      })}
    >
      Click here to view on Fuel Explorer
    </Link>
  );
}

const styles = {
  root: cssObj({
    textSize: 'sm',
  }),
};
