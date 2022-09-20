import { useMemo } from "react";

import { ASSET_LIST } from "../utils";

import { relativeUrl } from "~/systems/Core/utils/relativeUrl";

export function useAsset(assetId: string) {
  const asset = useMemo(() => {
    const assetItem = ASSET_LIST.find((asset) => asset.assetId === assetId);
    if (!assetItem) return null;

    // Fix image in according to the baseUrl
    assetItem.imageUrl = relativeUrl(assetItem.imageUrl);

    return assetItem;
  }, [assetId]);

  return (
    asset || {
      assetId: "0x",
      name: "Unknown",
      symbol: "",
      imageUrl: "",
    }
  );
}
