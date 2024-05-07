import { Provider } from 'fuels';
import { useEffect, useState } from 'react';

export function useBaseAssetId() {
  const [baseAssetId, setBaseAssetId] = useState<string>('');

  useEffect(() => {
    Provider.create(import.meta.env.VITE_FUEL_PROVIDER_URL!)
      .then((provider) => {
        setBaseAssetId(provider.getBaseAssetId());
      })
      .catch((err) => {
        console.log('Failed to get base asset id', err);
      });
  }, []);

  return baseAssetId;
}
