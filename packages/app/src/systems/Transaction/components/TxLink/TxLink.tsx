import { cssObj } from '@fuel-ui/css';
import { Link } from '@fuel-ui/react';
import { getBlockExplorerLink } from '@fuel-wallet/sdk';

export type TxLinkProps = {
  txHash?: string;
  providerUrl?: string;
};

export function TxLink({ txHash, providerUrl }: TxLinkProps) {
  return (
    <Link
      css={styles.root}
      isExternal
      href={getBlockExplorerLink({
        path: `/transaction/${txHash}`,
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
