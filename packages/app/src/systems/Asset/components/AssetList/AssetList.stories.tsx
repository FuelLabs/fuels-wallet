import { Box } from "@fuel-ui/react";
import { bn } from "fuels";

import { ASSET_LIST } from "../../utils";

import type { AssetListProps } from "./AssetList";
import { AssetList } from "./AssetList";

export default {
  component: AssetList,
  title: "Asset/Components/AssetList",
};

const ASSETS = ASSET_LIST.map(({ assetId }) => ({
  assetId,
  amount: bn(1000000000),
}));

export const Usage = (args: AssetListProps) => (
  <Box css={{ width: 300 }}>
    <AssetList {...args} assets={ASSETS} />
  </Box>
);

export const Loading = () => (
  <Box css={{ width: 300, height: 300 }}>
    <AssetList.Loading items={3} />
  </Box>
);

export const Empty = () => (
  <Box css={{ width: 300, height: 300 }}>
    <AssetList.Empty />
  </Box>
);

export const EmptyDevnet = () => (
  <Box css={{ width: 300, height: 300 }}>
    <AssetList.Empty isDevnet />
  </Box>
);
