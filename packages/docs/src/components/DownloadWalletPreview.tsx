import { WALLET_LINK_NEXT, WALLET_LINK_STAGING } from '../constants';

import { Link } from './Link';

export function DownloadWalletPreview({ staging }: { staging?: boolean }) {
  return (
    <Link href={staging ? WALLET_LINK_STAGING : WALLET_LINK_NEXT}>
      FuelWallet
    </Link>
  );
}
