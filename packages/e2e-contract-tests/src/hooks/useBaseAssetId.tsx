import { Provider } from 'fuels';
import { useEffect, useState } from 'react';

export function useBaseAssetId() {
  const [baseAssetId, setBaseAssetId] = useState<string>('');

  useEffect(() => {
    const provider = new Provider(import.meta.env.VITE_FUEL_PROVIDER_URL!);
    let abort = false;
    provider
      .getBaseAssetId()
      .then((assetId) => {
        if (abort) return;
        setBaseAssetId(assetId);
      })
      .catch((err) => {
        console.log('Failed to get base asset id', err);
      });
    return () => {
      abort = true;
    };
  }, []);

  return baseAssetId;
}
