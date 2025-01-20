import {
  ASSET_ENDPOINTS,
  DEFAULT_ASSET_ENDPOINT,
} from '~/systems/Asset/constants';

export async function convertAsset(
  chainId: number,
  assetId: string,
  amount: string
) {
  try {
    const endpoint =
      ASSET_ENDPOINTS[chainId.toString()] || DEFAULT_ASSET_ENDPOINT;
    if (!endpoint) return;
    const response = await fetch(`${endpoint}/convert_rate`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        assetId,
        amount,
      }),
    });
    return response.json();
  } catch (_) {}
}
