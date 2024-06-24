import {
  WALLET_DOWNLOAD_PATH,
  WALLET_LINK_NEXT,
  WALLET_LINK_STAGING,
} from '../constants';
import { useExtensionTitle } from '../hooks/useExtensionTitle';
import { useIsPreviewEnv } from '../hooks/useIsPreviewEnv';
import { Link } from './Link';

const alternativeWalletVersion = 'Staging';

export function DownloadWalletPreview() {
  const isPreview = useIsPreviewEnv();
  const title = useExtensionTitle();

  const alternativeWalletUrl =
    alternativeWalletVersion === 'Staging'
      ? WALLET_LINK_STAGING
      : WALLET_LINK_NEXT;

  const href = isPreview ? WALLET_DOWNLOAD_PATH : alternativeWalletUrl;

  return (
    <Link href={href}>
      {`${title}  ${isPreview ? 'Zip' : alternativeWalletVersion}`}
    </Link>
  );
}
