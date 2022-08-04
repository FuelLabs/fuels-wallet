import type { ThemeUtilsCSS } from "@fuel-ui/css";
import { cssObj } from "@fuel-ui/css";
import { Box, Flex } from "@fuel-ui/react";
import type { FC, ReactNode } from "react";
import { Helmet } from "react-helmet";

import { TopNav } from "./TopNav";

type ContentProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  as?: any;
  children: ReactNode;
  css?: ThemeUtilsCSS;
};

function Content({ as, children, css }: ContentProps) {
  return (
    <Box as={as} css={{ ...styles.content, ...css }}>
      {children}
    </Box>
  );
}

type LayoutProps = {
  title?: string;
  children: ReactNode;
};

type LayoutComponent = FC<LayoutProps> & {
  Content: FC<ContentProps>;
  TopNav: FC;
};

export const Layout: LayoutComponent = ({ title, children }: LayoutProps) => {
  const titleText = title ? `${title} | Verify` : "Verify";
  return (
    <>
      <Helmet>
        <title>{titleText}</title>
      </Helmet>
      <Flex as="main" css={styles.root}>
        <Box css={styles.wrapper}>{children}</Box>
      </Flex>
    </>
  );
};

Layout.Content = Content;
Layout.TopNav = TopNav;

const styles = {
  root: cssObj({
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    minH: "100vh",
  }),
  wrapper: cssObj({
    width: "350px",
    minHeight: "615px",
    // boxShadow: "$md",
    borderRadius: "$md",
    background:
      "linear-gradient(210.43deg, #0E221B 0%, #071614 10.03%, #0C0E0D 18.38%)",
  }),
  content: cssObj({
    py: "$4",
    px: "$6",
    flex: 1,
  }),
};
