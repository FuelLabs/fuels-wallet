export const BLOCK_EXPLORER_URL =
  'https://fuellabs.github.io/block-explorer-v2/';

export function getBlockExplorerLink({
  path,
  providerUrl,
}: {
  path: string;
  providerUrl: string;
}) {
  return `${BLOCK_EXPLORER_URL}${path}?providerUrl=${encodeURIComponent(
    providerUrl
  )}`;
}
