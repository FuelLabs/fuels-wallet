import { Box } from "@fuel-ui/react";
import { toBigInt } from "fuels";

import { ASSET_LIST } from "../../utils";

import type { AssetItemProps } from "./AssetItem";
import { AssetItem } from "./AssetItem";

export default {
  component: AssetItem,
  title: "Asset/Components/AssetItem",
};

export const Usage = (args: AssetItemProps) => (
  <Box css={{ width: 300 }}>
    <AssetItem
      {...args}
      asset={{
        assetId: ASSET_LIST[0].assetId,
        amount: toBigInt("14563943834")
      }}
    />
  </Box>
);

export const Loader = () => (
  <Box css={{ width: 300 }}>
    <AssetItem.Loader />
  </Box>
);
