import { CardList } from "@fuel-ui/react";
import type { CoinQuantity } from "fuels";
import type { FC } from "react";

import { AssetItem } from "../AssetItem";

import { AssetListEmpty } from "./AssetListEmpty";
import { AssetListLoading } from "./AssetListLoading";

export type AssetListProps = {
  assets: CoinQuantity[];
};

type AssetListComponent = FC<AssetListProps> & {
  Empty: typeof AssetListEmpty;
  Loading: typeof AssetListLoading;
};

export const AssetList: AssetListComponent = ({ assets }) => {
  return (
    <CardList>
      {assets.map((asset) => {
        return <AssetItem key={asset.assetId} asset={asset} />;
      })}
    </CardList>
  );
};

AssetList.Empty = AssetListEmpty;
AssetList.Loading = AssetListLoading;
