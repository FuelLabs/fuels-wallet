import { cssObj } from "@fuel-ui/css";
import { Avatar, CardList, Flex, Heading, Text } from "@fuel-ui/react";
import type { FC } from "react";

import { AssetItemLoader } from "./AssetItemLoader";

import { parseAndFormat, safeBigInt } from "~/systems/Core";
import type { Asset, Maybe } from "~/types";

export type AssetItemProps = {
  asset: Asset;
  amount: Maybe<bigint>;
};

type AssetItemComponent = FC<AssetItemProps> & {
  Loader: typeof AssetItemLoader;
};

export const AssetItem: AssetItemComponent = ({ asset, amount }) => {
  const rightEl = (
    <Text css={{ fontSize: "$sm", fontWeight: "$semibold" }}>
      {parseAndFormat(safeBigInt(amount))} {asset.symbol}
    </Text>
  );

  return (
    <CardList.Item rightEl={rightEl} css={{ alignItems: "center" }}>
      <Avatar size="md" name={asset.name} src={asset.imageUrl} />
      <Flex direction="column">
        <Heading as="h6" css={styles.assetName}>
          {asset.name}
        </Heading>
        <Text css={styles.assetSymbol}>{asset.symbol}</Text>
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
