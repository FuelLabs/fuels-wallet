import { cssObj } from "@fuel-ui/css";
import { Flex } from "@fuel-ui/react";
import type { ReactNode } from "react";

type BottomBarProps = {
  children: ReactNode;
};

export function BottomBar({ children }: BottomBarProps) {
  return (
    <Flex align="center" gap="$4" css={styles.root}>
      {children}
    </Flex>
  );
}

const styles = {
  root: cssObj({
    width: "100%",
    px: "$4",
    py: "$4",
    boxSizing: "border-box",
  }),
};
