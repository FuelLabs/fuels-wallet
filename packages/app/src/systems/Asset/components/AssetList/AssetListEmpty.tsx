import { cssObj } from "@fuel-ui/css";
import {
  Image,
  Text,
  BoxCentered,
  Heading,
  Button,
  Icon,
} from "@fuel-ui/react";

import { useFaucetDialog } from "~/systems/Faucet";

type AssetsEmptyProps = {
  isDevnet?: boolean;
};
export function AssetListEmpty({ isDevnet }: AssetsEmptyProps) {
  const faucetDialog = useFaucetDialog();

  return (
    <BoxCentered css={styles.empty}>
      <Image src="/empty-assets.png" width={183} height={144} alt="No assets" />
      <Heading as="h5">You don&apos;t have any assets</Heading>
      {!isDevnet ? (
        <Text fontSize="sm">Start depositing some assets</Text>
      ) : (
        /**
         * TODO: need to add right faucet icon on @fuel-ui
         */
        <Button
          {...faucetDialog.openButtonProps}
          size="sm"
          leftIcon={Icon.is("Coffee")}
        >
          Faucet
        </Button>
      )}
    </BoxCentered>
  );
}

const styles = {
  empty: cssObj({
    width: "100%",
    height: "100%",
    flexDirection: "column",
    textAlign: "center",

    img: {
      transform: "translateX(-10px)",
      mb: "$5",
    },

    h5: {
      margin: 0,
    },
    button: {
      mt: "$2",
    },
  }),
};
