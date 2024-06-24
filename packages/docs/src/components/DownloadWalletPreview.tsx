import { useContext } from 'react';
import {
  DomainContext,
  WALLET_DOWNLOAD_PATH,
  WALLET_LINK_NEXT,
  WALLET_LINK_STAGING,
} from '../constants';

import { Link } from './Link';

const alternativeWalletVersion = 'Staging';

export function DownloadWalletPreview() {
  const currentDomainUrl = useContext(DomainContext);

  const isPreviewEnvironment =
    !!currentDomainUrl?.includes(WALLET_LINK_STAGING) ||
    !!currentDomainUrl?.includes(WALLET_LINK_NEXT);

  const alternativeWalletUrl =
    alternativeWalletVersion === 'Staging'
      ? WALLET_LINK_STAGING
      : WALLET_LINK_NEXT;

  const href = isPreviewEnvironment
    ? WALLET_DOWNLOAD_PATH
    : alternativeWalletUrl;

  return (
    <Link href={href}>
      FuelWallet {isPreviewEnvironment ? 'Zip' : alternativeWalletVersion}
    </Link>
  );
}
