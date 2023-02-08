import type { ThemeUtilsCSS } from '@fuel-ui/css';
import { cssObj } from '@fuel-ui/css';
import { Box, Flex } from '@fuel-ui/react';
import type { FC, ReactNode } from 'react';
import { forwardRef, useRef, useContext, createContext } from 'react';
import { Helmet } from 'react-helmet';
import { useLocation } from 'react-router-dom';

import { coreStyles } from '../styles';

import { BottomBar } from './BottomBar';
import { TopBar } from './TopBar';

import { IS_CRX_POPUP, WALLET_HEIGHT, WALLET_WIDTH } from '~/config';
import { AccountsDialog } from '~/systems/Account';

type Context = {
  isLoading?: boolean;
  isHome?: boolean;
  title?: string;
  ref?: React.RefObject<HTMLDivElement>;
};

const ctx = createContext<Context>({});

type ContentProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  as?: any;
  children: ReactNode;
  css?: ThemeUtilsCSS;
};

const Content = forwardRef<HTMLDivElement, ContentProps>(
  ({ as, children, css }, ref) => {
    return (
      <Box
        as={as}
        css={{ ...styles.content, ...css }}
        className="layout_content"
      >
        <Box css={styles.scrollContainer} className="layout_content-scroll">
          <Box
            ref={ref}
            css={styles.insideScrolContent}
            className="layout_content-inside"
          >
            {children}
          </Box>
        </Box>
      </Box>
    );
  }
);

export type LayoutProps = Context & {
  isPublic?: boolean;
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
  title,
  children,
}: LayoutProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const titleText = title ? `${title} | Fuel` : 'Fuel';
  const location = useLocation();
  const isHome = location.pathname === '/wallet';

  return (
    <>
      <AccountsDialog />
      <ctx.Provider value={{ isLoading, title, isHome, ref }}>
        <Helmet>
          <title>{titleText}</title>
        </Helmet>
        <Flex as="main" css={styles.root} data-public={isPublic}>
          {isPublic ? (
            <>{children}</>
          ) : (
            <Flex css={styles.wrapper} ref={ref} className="layout_wrapper">
              {children}
            </Flex>
          )}
        </Flex>
        {import.meta.env.NODE_ENV === 'test' && (
          <Box css={{ visibility: 'hidden' }}>
            {isLoading ? 'is loading' : 'is loaded'}
          </Box>
        )}
      </ctx.Provider>
    </>
  );
};

Layout.Content = Content;
Layout.TopBar = TopBar;
Layout.BottomBar = BottomBar;

const styles = {
  root: cssObj({
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    minH: '100vh',
    width: IS_CRX_POPUP ? WALLET_WIDTH : '100vw',

    '&[data-public="true"]': {
      background:
        'linear-gradient(197.05deg, #0E221B 0%, #071614 22.2%, #0C0E0D 40.7%);',
    },
  }),
  wrapper: cssObj({
    overflow: 'hidden',
    position: 'relative',
    flexDirection: 'column',

    width: WALLET_WIDTH,
    height: WALLET_HEIGHT,
    background:
      'linear-gradient(210.43deg, #0E221B 0%, #071614 10.03%, #0C0E0D 18.38%)',
  }),
  content: cssObj({
    flex: 1,
    overflow: 'hidden',
  }),
  insideScrolContent: cssObj({
    py: '$4',
    px: '$4',
  }),
  scrollContainer: cssObj({
    ...coreStyles.scrollable(),
    height: '100%',
  }),
};

export function useLayoutContext() {
  return useContext(ctx);
}
