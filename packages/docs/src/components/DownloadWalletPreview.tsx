import {
  WALLET_DOWNLOAD_PATH,
  WALLET_LINK_NEXT,
  WALLET_LINK_STAGING,
} from '../constants';
import { Environment, useCurrentEnv } from '../hooks/useCurrentEnv';
import { useExtensionTitle } from '../hooks/useExtensionTitle';
import { Link } from './Link';

const alternativeWalletVersion = 'Staging';

export function DownloadWalletPreview() {
  const environment = useCurrentEnv();
  const title = useExtensionTitle();
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
      {`${title}  ${isPreviewEnvironment ? 'Zip' : alternativeWalletVersion}`}
    </Link>
  );
}
