import { CardList } from '@fuel-ui/react';

import { AssetItem } from '../AssetItem';

type AssetListLoadingProps = {
  items?: number;
};

export function AssetListLoading({ items = 5 }: AssetListLoadingProps) {
  return (
    <CardList>
      {Array.from({ length: items }).map((_, idx) => (
        <AssetItem.Loader key={idx} />
      ))}
    </CardList>
  );
}
