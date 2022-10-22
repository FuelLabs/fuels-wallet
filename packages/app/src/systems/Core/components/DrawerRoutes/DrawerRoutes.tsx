/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { cssObj } from '@fuel-ui/css';
import { Drawer, Flex } from '@fuel-ui/react';
import { useRef, useState, useEffect } from 'react';
import type { RouteProps, RoutesProps } from 'react-router-dom';
import { Outlet, Route, Routes, useLocation } from 'react-router-dom';

import { Pages } from '../../types';

import { WALLET_HEIGHT, WALLET_WIDTH } from '~/config';

type DrawerRoutesContainerProps = {
  isOpen: boolean;
  noDrawer: boolean;
  onClose: () => void;
};

type DrawerRoutesProps = {
  avoidDrawer?: Array<string>;
} & RoutesProps &
  Pick<RouteProps, 'element'>;

export function DrawerRouterContainer({
  isOpen,
  noDrawer,
  onClose,
  element,
}: DrawerRoutesContainerProps & Pick<RouteProps, 'element'>) {
  const containerRef = useRef<HTMLDivElement>(null);
  return (
    <Flex justify="center" align="center" css={styles.root}>
      <Flex ref={containerRef} css={styles.container}>
        {element}
        {noDrawer ? (
          <Outlet />
        ) : (
          <Drawer
            type="dialog"
            size={WALLET_WIDTH}
            isOpen={isOpen}
            containerRef={containerRef}
            css={styles.drawer}
          >
            <Drawer.Content
              css={styles.drawer}
              transition={{
                duration: 0.4,
              }}
              // @ts-ignore
              onAnimationComplete={(e) => {
                if (e.x === '100%') onClose();
              }}
            >
              <Outlet />
            </Drawer.Content>
          </Drawer>
        )}
      </Flex>
    </Flex>
  );
}

function getSubRoutesPath(routes: any): Array<string> {
  return routes.map((route: any) => route.props.path);
}

export function DrawerRoutes({
  children,
  element,
  avoidDrawer,
}: DrawerRoutesProps) {
  const location = useLocation();
  const [currentLocation, setCurrentLocation] = useState<string>('');
  const noDrawer = (avoidDrawer || []).includes(location.pathname);
  const isOpen = location.pathname !== Pages.wallet();
  const subPaths = getSubRoutesPath(children);

  useEffect(() => {
    if (isOpen) {
      setCurrentLocation(location.pathname);
    } else if (!subPaths.includes(currentLocation)) {
      setCurrentLocation(location.pathname);
    }
  }, [isOpen, location.pathname]);

  function handleClose() {
    setCurrentLocation(Pages.wallet());
  }

  return (
    <Routes location={currentLocation}>
      <Route
        path={Pages.wallet()}
        element={
          <DrawerRouterContainer
            noDrawer={noDrawer}
            onClose={handleClose}
            isOpen={isOpen}
            element={element}
          />
        }
      >
        {children}
      </Route>
    </Routes>
  );
}

const styles = {
  root: cssObj({
    height: '100vh',
    width: '100vw',
    position: 'relative',
    overflow: 'hidden',
  }),
  container: cssObj({
    height: WALLET_HEIGHT,
    width: WALLET_WIDTH,
    position: 'relative',
    overflow: 'hidden',
  }),
  drawer: cssObj({
    backgroundColor: 'transparent !important',
    outlineWidth: '0px !important',
  }),
};
