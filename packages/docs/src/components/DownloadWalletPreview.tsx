import { WALLET_DOWNLOAD_PATH } from '../constants';
import { useExtensionTitle } from '../hooks/useExtensionTitle';
import { Link } from './Link';

export function DownloadWalletPreview() {
  const title = useExtensionTitle();

  return <Link href={WALLET_DOWNLOAD_PATH}>{`${title}  zip file`}</Link>;
}
