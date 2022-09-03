import { ASSET_LIST } from "../utils";

export function useAsset(assetId: string) {
  const asset = ASSET_LIST.find(asset => asset.assetId === assetId);

  return asset || {
    assetId:
    "0x",
    name: "Unknown",
    symbol: "",
    imageUrl: "",
  } 
}