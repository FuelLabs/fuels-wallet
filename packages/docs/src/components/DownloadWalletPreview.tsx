import { useContext } from 'react';
import {
  DomainContext,
  WALLET_DOWNLOAD_PATH,
  WALLET_LINK_NEXT,
  WALLET_LINK_STAGING,
} from '../constants';

import { Link } from './Link';

export function DownloadWalletPreview() {
  const currentDomainUrl = useContext(DomainContext);

  const isPreviewEnvironment =
    !!currentDomainUrl?.includes(WALLET_LINK_STAGING) ||
    !!currentDomainUrl?.includes(WALLET_LINK_NEXT);

  const href = isPreviewEnvironment
    ? WALLET_DOWNLOAD_PATH
    : WALLET_LINK_STAGING;

  return (
    <Link href={href}>FuelWallet{isPreviewEnvironment ? ' Zip' : ''}</Link>
  );
}
