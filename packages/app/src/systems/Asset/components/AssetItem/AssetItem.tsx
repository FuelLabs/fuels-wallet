import { cssObj } from "@fuel-ui/css";
import {
  Avatar,
  CardList,
  Copyable,
  Flex,
  Heading,
  Text,
} from "@fuel-ui/react";
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
        <Copyable value={asset.assetId} css={styles.assetName}>
          <Heading as="h6" css={styles.assetName}>
            {asset.name}
          </Heading>
        </Copyable>
        <Text css={styles.assetSymbol}>{asset.symbol}</Text>
      </Flex>
    </CardList.Item>
  );
};

AssetItem.Loader = AssetItemLoader;

const styles = {
  assetName: cssObj({
    ".fuel_copyable-icon": {
      py: "$2 !important",
      height: "$2 !important",
    },
    h6: {
      margin: 0,
      fontSize: "$sm",
    },
  }),
  assetSymbol: cssObj({
    textSize: "sm",
    fontWeight: "$semibold",
  }),
};
