import { Button, CardList } from '@fuel-ui/react';
import type { AssetAmount } from '@fuel-wallet/types';
import type { FC } from 'react';
import { useMemo, useState } from 'react';

import { AssetItem } from '../AssetItem';

import type { AssetListEmptyProps } from './AssetListEmpty';
import { AssetListEmpty } from './AssetListEmpty';
import { AssetListLoading } from './AssetListLoading';

export type AssetListProps = {
  assets?: AssetAmount[];
  isLoading?: boolean;
  showActions?: boolean;
  onRemove?: (assetId: string) => void;
  onEdit?: (assetId: string) => void;
  emptyProps?: AssetListEmptyProps;
};

type AssetListComponent = FC<AssetListProps> & {
  Empty: typeof AssetListEmpty;
  Loading: typeof AssetListLoading;
};

export const AssetList: AssetListComponent = ({
  assets,
  isLoading,
  emptyProps = {},
  showActions,
  onRemove,
  onEdit,
}) => {
  const [showUnknown, setShowUnknown] = useState(false);
  const unknownLength = useMemo(
    () => assets?.filter((assetAmount) => !assetAmount?.name).length,
    [assets]
  );

  if (isLoading) return <AssetList.Loading items={4} />;
  const isEmpty = !assets || !assets.length;
  if (isEmpty) return <AssetList.Empty {...emptyProps} />;
  const assetsToShow = assets.filter((asset) => showUnknown || asset?.name);

  function toggle() {
    setShowUnknown((s) => !s);
  }
  return (
    <CardList>
      {assetsToShow.map((asset) => (
        <AssetItem
          key={asset.assetId}
          asset={asset}
          showActions={showActions}
          onRemove={onRemove}
          onEdit={onEdit}
        />
      ))}
      {!!(!isLoading && unknownLength) && (
        <Button size="xs" color="intentsBase" variant="link" onPress={toggle}>
          {showUnknown ? 'Hide' : 'Show'} unknown assets ({unknownLength})
        </Button>
      )}
    </CardList>
  );
};

AssetList.Empty = AssetListEmpty;
AssetList.Loading = AssetListLoading;
