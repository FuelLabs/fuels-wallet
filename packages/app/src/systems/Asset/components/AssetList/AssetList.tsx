import { Button, CardList } from '@fuel-ui/react';
import type { Asset, Coin } from '@fuel-wallet/types';
import type { FC } from 'react';
import { useEffect, useState } from 'react';

import { useAssets } from '../../hooks';
import { AssetItem } from '../AssetItem';

import { AssetListEmpty } from './AssetListEmpty';
import { AssetListLoading } from './AssetListLoading';

export type AssetListProps = {
  coins?: Coin[];
  isLoading?: boolean;
  isDevnet?: boolean;
  showActions?: boolean;
  onRemove?: (assetId: string) => void;
};

type AssetListComponent = FC<AssetListProps> & {
  Empty: typeof AssetListEmpty;
  Loading: typeof AssetListLoading;
};

export const AssetList: AssetListComponent = ({
  coins,
  isLoading,
  isDevnet,
  showActions,
  onRemove,
}) => {
  const { assets } = useAssets();
  const [showUnknown, setShowUnknown] = useState(false);
  const [unknownCoinIds, setUnknownCoinIds] = useState<string[]>();

  useEffect(() => {
    const unknownCoins = coins
      ?.filter(
        ({ assetId }) => !assets.find((a: Asset) => a.assetId === assetId)
      )
      .map(({ assetId }) => assetId);
    setUnknownCoinIds(unknownCoins);
  }, [coins, assets]);

  function toggle() {
    setShowUnknown((s) => !s);
  }

  if (isLoading) return <AssetList.Loading items={4} />;

  const isEmpty = !coins || !coins.length;
  if (isEmpty) return <AssetList.Empty isDevnet={isDevnet} />;

  return (
    <CardList>
      {coins.map((coin) => {
        return (
          <AssetItem
            key={coin.assetId}
            coin={coin}
            showActions={showActions}
            isHidden={
              !!(!showUnknown && unknownCoinIds?.includes(coin.assetId))
            }
            onRemove={onRemove}
          />
        );
      })}
      {!!(!isLoading && unknownCoinIds?.length) && (
        <Button size="xs" color="gray" variant="link" onPress={toggle}>
          {showUnknown ? 'Hide' : 'Show'} unknown assets (
          {unknownCoinIds.length})
        </Button>
      )}
    </CardList>
  );
};

AssetList.Empty = AssetListEmpty;
AssetList.Loading = AssetListLoading;
