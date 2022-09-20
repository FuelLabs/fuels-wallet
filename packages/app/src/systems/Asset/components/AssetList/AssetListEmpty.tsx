import { cssObj } from "@fuel-ui/css";
import { Text, BoxCentered, Heading, Button, Icon } from "@fuel-ui/react";
import { useNavigate } from "react-router-dom";

import { ImageLoader, Pages, relativeUrl } from "~/systems/Core";

type AssetsEmptyProps = {
  isDevnet?: boolean;
};

export function AssetListEmpty({ isDevnet }: AssetsEmptyProps) {
  const navigate = useNavigate();
  return (
    <BoxCentered css={styles.empty}>
      <ImageLoader
        src={relativeUrl("/empty-assets.png")}
        width={183}
        height={144}
        alt="No assets"
        wrapperCSS={{ mb: "$5" }}
      />
      <Heading as="h5">You don&apos;t have any assets</Heading>
      {!isDevnet ? (
        <Text fontSize="sm">Start depositing some assets</Text>
      ) : (
        /**
         * TODO: need to add right faucet icon on @fuel-ui
         */
        <Button
          size="sm"
          leftIcon={Icon.is("Coffee")}
          onPress={() => navigate(Pages.faucet)}
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
