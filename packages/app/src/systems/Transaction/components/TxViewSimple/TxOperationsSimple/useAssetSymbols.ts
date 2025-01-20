import { useEffect, useState } from 'react';
import { AssetService } from '~/systems/Asset/services/assets';
import type { SimplifiedOperation } from '../../../types';
import { isSwapMetadata } from './utils';

export function useAssetSymbols(operations: SimplifiedOperation[]) {
  const [assetSymbols, setAssetSymbols] = useState<Record<string, string>>({});

  useEffect(() => {
    async function loadAssetSymbols() {
      const symbols: Record<string, string> = {};
      if (operations) {
        const allAssets = await AssetService.getAssets();
        for (const op of operations) {
          if (op.assetId) {
            const asset = allAssets.find((a) =>
              a.networks?.some(
                (n) => n.type === 'fuel' && n.assetId === op.assetId
              )
            );
            if (asset) {
              symbols[op.assetId] = asset.symbol;
            }
          }
          const metadata = op.metadata;
          if (isSwapMetadata(metadata)) {
            const asset = allAssets.find((a) =>
              a.networks?.some(
                (n) =>
                  n.type === 'fuel' && n.assetId === metadata.receiveAssetId
              )
            );
            if (asset) {
              symbols[metadata.receiveAssetId] = asset.symbol;
            }
          }
        }
      }
      setAssetSymbols(symbols);
    }
    loadAssetSymbols();
  }, [operations]);

  return { assetSymbols };
}
