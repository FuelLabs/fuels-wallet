import { cssObj } from "@fuel-ui/css";
import { Flex } from "@fuel-ui/react";

export function TopNav() {
  return (
    <Flex as="nav" css={styles.root}>
      Topnav
    </Flex>
  );
}

const styles = {
  root: cssObj({
    alignItems: "center",
    py: "$2",
    px: "$6",
    height: "50px",
    boxShadow: "$sm",
    borderTopLeftRadius: "$md",
    borderTopRightRadius: "$md",
    background:
      "linear-gradient(268.61deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.02) 87.23%)",
  }),
};
