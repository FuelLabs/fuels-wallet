import {
  WALLET_DOWNLOAD_PATH,
  WALLET_LINK_NEXT,
  WALLET_LINK_STAGING,
} from '../constants';
import { Environment, useCurrentEnv } from '../hooks/useCurrentEnv';
import { Link } from './Link';

const alternativeWalletVersion = 'Staging';

export function DownloadWalletPreview() {
  const environment = useCurrentEnv();
  const isStaging = environment === Environment.STAGING;
  const isNext = environment === Environment.NEXT;
  const isPreviewEnvironment = isStaging || isNext;

  const alternativeWalletUrl =
    alternativeWalletVersion === 'Staging'
      ? WALLET_LINK_STAGING
      : WALLET_LINK_NEXT;

  const href = isPreviewEnvironment
    ? WALLET_DOWNLOAD_PATH
    : alternativeWalletUrl;

  return (
    <Link href={href}>
      {`FuelWallet ${isStaging ? 'Development' : ''}  ${
        isPreviewEnvironment ? 'Zip' : alternativeWalletVersion
      }`}
    </Link>
  );
}
