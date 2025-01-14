import type { ThemeUtilsCSS } from '@fuel-ui/css';
import { cssObj } from '@fuel-ui/css';
import { Box } from '@fuel-ui/react';
import type { FC, ReactNode } from 'react';
import { createContext, forwardRef, useContext, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { useLocation } from 'react-router-dom';
import { IS_CRX_POPUP, WALLET_HEIGHT, WALLET_WIDTH } from '~/config';
import { OverlayDialog } from '~/systems/Overlay';
import { Sidebar } from '~/systems/Sidebar';

import { coreStyles } from '../../styles/core';

import { BottomBar } from './BottomBar';
import { TopBar } from './TopBar';

type Context = {
  isLoading?: boolean;
  isHome?: boolean;
  title?: string;
  ref?: React.RefObject<HTMLDivElement>;
};

const ctx = createContext<Context>({});

type ContentProps = {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  as?: any;
  children: ReactNode;
  css?: ThemeUtilsCSS;
  noBorder?: boolean;
  noScroll?: boolean;
};

const Content = forwardRef<HTMLDivElement, ContentProps>(
  ({ as, children, css, noBorder, noScroll = false }, ref) => {
    return (
      <Box
        as={as}
        ref={ref}
        css={{ ...styles.content, ...css }}
        className="layout__content"
        data-noborder={noBorder}
        data-scrollable={!noScroll}
      >
        {children}
      </Box>
    );
  }
);

export type LayoutProps = Context & {
  children: ReactNode;
  isPublic?: boolean;
  noBorder?: boolean;
  isCentered?: boolean;
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
  noBorder,
  isCentered,
}: LayoutProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const titleText = title ? `${title} | Fuel` : 'Fuel';
  const location = useLocation();
  const isHome = location.pathname === '/wallet';

  return (
    <>
      <ctx.Provider value={{ isLoading, title, isHome, ref }}>
        <Helmet>
          <title>{titleText}</title>
        </Helmet>
        {isPublic ? (
          <Box
            as="main"
            css={{ ...styles.root, ...styles.public }}
            data-public
            data-centered={isCentered}
          >
            <Box.Centered>{children}</Box.Centered>
          </Box>
        ) : (
          <Box.Centered as="main" css={styles.root}>
            <Box
              css={styles.wrapper}
              className="layout__wrapper"
              data-noborder={noBorder}
            >
              <OverlayDialog />
              <Sidebar ref={ref} />
              <Box ref={ref} css={styles.inner} className="layout__inner">
                {children}
              </Box>
            </Box>
          </Box.Centered>
        )}
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

export const styles = {
  root: cssObj({
    width: IS_CRX_POPUP ? WALLET_WIDTH : '100vw',
    position: 'relative',
    height: '100vh',
    maxHeight: '100vh',
    ...coreStyles.scrollable(),

    '&:has(.layout__bottom) .layout__content': {
      pb: '$0',
    },
  }),
  wrapper: cssObj({
    zIndex: '$0',
    overflow: 'clip',
    position: 'relative',
    width: WALLET_WIDTH - 2, // reduce the border to contain width inside the window
    height: WALLET_HEIGHT - 2, // reduce the border to contain height inside the window
    background: '$bodyColor',
    border: '1px solid $border',

    '&[data-noborder=true]': {
      border: '$none',
    },
  }),
  inner: coreStyles.fullscreen,
  content: cssObj({
    padding: '$0 $4 $4 $4',
    flex: 1,
    '&[data-scrollable=true]:not([data-noborder])': {
      padding: '$0 $0 $4 $4',
      ...coreStyles.scrollable(),
      overflowY: 'scroll !important',
    },
    '&[data-noborder]': {
      padding: '$0',
    },
  }),
  public: cssObj({
    maxWidth: '100vw',
    display: 'grid',
    gridTemplateColumns: '0.75fr 1.25fr',
    gridTemplateRows: '1fr',
    alignItems: 'flex-start',

    'html[class="fuel_light-theme"] &': {
      bg: '$intentsBase2',
    },

    '& > .fuel_Box-centered': {
      maxWidth: '$sm',
      height: 650,
      margin: 'auto',
      alignItems: 'flex-start !important',
    },

    '&[data-centered=true]': {
      alignItems: 'center',

      '& > .fuel_Box-centered': {
        margin: '0 auto',
      },
    },

    '&::before': {
      content: '""',
      display: 'block',
      position: 'sticky',
      top: 0,
      bottom: 0,
      width: '100%',
      height: '100vh',
      background: 'url(/signup.png)',
      backgroundPosition: 'left',
      backgroundSize: 'cover',
    },
  }),
};

export function useLayoutContext() {
  return useContext(ctx);
}
