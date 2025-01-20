import {
  ASSET_ENDPOINTS,
  DEFAULT_ASSET_ENDPOINT,
} from '~/systems/Asset/constants';

interface ConvertAssetResponse {
  amount: `${number}`;
}

export async function convertAsset(
  chainId: number | undefined,
  assetId: string,
  amount: string
) {
  try {
    const endpoint =
      (chainId && ASSET_ENDPOINTS[chainId.toString()]) ||
      DEFAULT_ASSET_ENDPOINT;
    if (!endpoint) return;
    const response = await fetch(`${endpoint.url}/convert_rate`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        assetId,
        amount,
      }),
    });
    return response.json() as Promise<ConvertAssetResponse>;
  } catch (_) {}
}
