import { DOWNLOAD_LINK } from '../constants';

import { Link } from './Link';

export function DownloadWalletZip() {
  return (
    <Link href={DOWNLOAD_LINK} download>
      FuelWallet zip file
    </Link>
  );
}
