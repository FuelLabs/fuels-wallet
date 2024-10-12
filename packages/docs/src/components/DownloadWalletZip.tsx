import { WALLET_DOWNLOAD_PATH } from '../constants';
import { Link } from './Link';

export function DownloadWalletZip() {
  return <Link href={WALLET_DOWNLOAD_PATH}>Fuwl Wallet zip file</Link>;
}
