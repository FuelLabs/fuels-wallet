import { CardList } from "@fuel-ui/react";
import type { FC } from "react";

import { AssetItem } from "../AssetItem";

import { AssetListEmpty } from "./AssetListEmpty";
import { AssetListLoading } from "./AssetListLoading";

import type { Asset } from "~/systems/Asset";
import type { AmountMap } from "~/systems/Core";

export type AssetListProps = {
  assets: Asset[];
  amounts?: AmountMap;
};

type AssetListComponent = FC<AssetListProps> & {
  Empty: typeof AssetListEmpty;
  Loading: typeof AssetListLoading;
};

export const AssetList: AssetListComponent = ({ assets, amounts }) => {
  return (
    <CardList>
      {assets.map((asset) => {
        return (
          <AssetItem
            key={asset.assetId}
            asset={asset}
            amount={amounts?.[asset.assetId]}
          />
        );
      })}
    </CardList>
  );
};

AssetList.Empty = AssetListEmpty;
AssetList.Loading = AssetListLoading;
