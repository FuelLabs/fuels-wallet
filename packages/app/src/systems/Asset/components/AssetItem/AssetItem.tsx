import { cssObj } from "@fuel-ui/css";
import { Avatar, CardList, Flex, Heading, Text } from "@fuel-ui/react";
import type { CoinQuantity } from "fuels";
import type { FC } from "react";

import { useAsset } from "../../hooks/useAsset";

import { AssetItemLoader } from "./AssetItemLoader";

import { formatUnits } from "~/systems/Core";

export type AssetItemProps = {
  asset: CoinQuantity;
};

type AssetItemComponent = FC<AssetItemProps> & {
  Loader: typeof AssetItemLoader;
};

export const AssetItem: AssetItemComponent = ({ asset }) => {
  const { symbol, name, imageUrl } = useAsset(asset.assetId);

  const rightEl = (
    <Text css={{ fontSize: "$sm", fontWeight: "$semibold" }}>
      {formatUnits(asset.amount)} {symbol}
    </Text>
  );

  return (
    <CardList.Item
      rightEl={rightEl}
      css={{ alignItems: "center", padding: "$2" }}
    >
      <Avatar name={name} src={imageUrl} css={{ height: 36, width: 36 }} />
      <Flex direction="column">
        <Heading as="h6" css={styles.assetName}>
          {name}
        </Heading>
        <Text css={styles.assetSymbol}>{symbol}</Text>
      </Flex>
    </CardList.Item>
  );
};

AssetItem.Loader = AssetItemLoader;

const styles = {
  assetName: cssObj({
    margin: 0,
    fontSize: "$sm",
  }),
  assetSymbol: cssObj({
    textSize: "sm",
    fontWeight: "$semibold",
  }),
};
