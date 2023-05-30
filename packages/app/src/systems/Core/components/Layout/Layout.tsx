import type { ThemeUtilsCSS } from '@fuel-ui/css';
import { cssObj } from '@fuel-ui/css';
import { Box } from '@fuel-ui/react';
import type { FC, ReactNode } from 'react';
import { forwardRef, useRef, useContext, createContext } from 'react';
import { Helmet } from 'react-helmet';
import { useLocation } from 'react-router-dom';

import { coreStyles } from '../../styles/core';

import { BottomBar } from './BottomBar';
import { TopBar } from './TopBar';

import { IS_CRX_POPUP, WALLET_HEIGHT, WALLET_WIDTH } from '~/config';
import { OverlayDialog } from '~/systems/Overlay';
import { Sidebar } from '~/systems/Sidebar';
import signUpImage from '~public/signup.png';

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
  noBorder?: boolean;
};

const Content = forwardRef<HTMLDivElement, ContentProps>(
  ({ as, children, css, noBorder }, ref) => {
    return (
      <Box
        as={as}
        ref={ref}
        css={{ ...styles.content, ...css }}
        className="layout__content"
        data-noborder={noBorder}
      >
        {children}
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
      <ctx.Provider value={{ isLoading, title, isHome, ref }}>
        <Helmet>
          <title>{titleText}</title>
        </Helmet>
        {isPublic ? (
          <Box as="main" css={{ ...styles.root, ...styles.public }} data-public>
            <Box.Centered>{children}</Box.Centered>
          </Box>
        ) : (
          <Box.Centered as="main" css={styles.root}>
            <Box css={styles.wrapper} className="layout__wrapper">
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
    minH: '100vh',
    width: IS_CRX_POPUP ? WALLET_WIDTH : '100vw',

    '&:has(.layout__bottom) .layout__content': {
      pb: '$0',
    },
  }),
  wrapper: cssObj({
    overflow: 'clip',
    position: 'relative',
    width: WALLET_WIDTH - 2, // reduce the border to contain width inside the window
    height: WALLET_HEIGHT - 2, // reduce the border to contain width inside the window
    background: '$bodyColor',
    zIndex: '$0',
    border: '1px solid $border',
    borderRadius: IS_CRX_POPUP ? 0 : '$default',
  }),
  inner: coreStyles.fullscreen,
  content: cssObj({
    ...coreStyles.scrollable(),
    padding: '$0 $4',
    flex: 1,

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

    '& > .fuel_Box-centered': {
      maxWidth: '$sm',
      margin: '$14 auto',
    },

    '&::before': {
      content: '""',
      display: 'block',
      width: '100%',
      height: '100%',
      background: `url(${signUpImage})`,
      backgroundPosition: 'left',
    },
  }),
};

export function useLayoutContext() {
  return useContext(ctx);
}
