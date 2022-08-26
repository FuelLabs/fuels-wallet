import type { Asset } from "~/systems/Asset";

/**
 * TODO: change this for something automatic, this is here just for development purposes
 */
export const ASSET_LIST: Asset[] = [
  {
    assetId:
      "0x0000000000000000000000000000000000000000000000000000000000000000",
    name: "Ethereum",
    symbol: "ETH",
    imageUrl: "assets/eth.svg",
  },
  {
    assetId: "0x6b175474e89094c44da98b954eedeac495271d0f",
    name: "Dai",
    symbol: "DAI",
    imageUrl: "assets/dai.svg",
  },
  {
    assetId: "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599",
    name: "Bitcoin",
    symbol: "BTC",
    imageUrl: "assets/btc.svg",
  },
];
