import type { ThemeUtilsCSS } from '@fuel-ui/css';
import { cssObj } from '@fuel-ui/css';
import { Box, Flex } from '@fuel-ui/react';
import type { FC, ReactNode } from 'react';
import { useContext, createContext } from 'react';
import { Helmet } from 'react-helmet';

import { BottomBar } from './BottomBar';
import { TopBar } from './TopBar';

type Context = {
  isLoading?: boolean;
  isHome?: boolean;
  title?: string;
};

const ctx = createContext<Context>({});

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

export type LayoutProps = {
  isPublic?: boolean;
  isLoading?: boolean;
  isHome?: boolean;
  title?: string;
  children: ReactNode;
};

type LayoutComponent = FC<LayoutProps> & {
  Content: typeof Content;
  TopBar: typeof TopBar;
  BottomBar: typeof BottomBar;
};

export const Layout: LayoutComponent = ({
  isPublic,
  isLoading,
  isHome,
  title,
  children,
}: LayoutProps) => {
  const titleText = title ? `${title} | Fuel` : 'Fuel';
  return (
    <ctx.Provider value={{ isLoading, isHome, title }}>
      <Helmet>
        <title>{titleText}</title>
      </Helmet>
      <Flex as="main" css={styles.root({ isPublic })}>
        {isPublic ? <>{children}</> : <Flex css={styles.wrapper}>{children}</Flex>}
      </Flex>
      {import.meta.env.NODE_ENV === 'test' && (
        <Box css={{ visibility: 'hidden' }}>{isLoading ? 'is loading' : 'is loaded'}</Box>
      )}
    </ctx.Provider>
  );
};

Layout.Content = Content;
Layout.TopBar = TopBar;
Layout.BottomBar = BottomBar;

const styles = {
  root: ({ isPublic }: Partial<LayoutProps>) =>
    cssObj({
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      minH: '100vh',
      ...(isPublic && {
        background: 'linear-gradient(197.05deg, #0E221B 0%, #071614 22.2%, #0C0E0D 40.7%);',
      }),
    }),
  wrapper: cssObj({
    flexDirection: 'column',
    width: '350px',
    height: '615px',
    borderRadius: '$md',
    background: 'linear-gradient(210.43deg, #0E221B 0%, #071614 10.03%, #0C0E0D 18.38%)',
  }),
  content: cssObj({
    paddingTop: '$1',
    px: '$6',
    flex: 1,
  }),
};

export function useLayoutContext() {
  return useContext(ctx);
}
