/* eslint-disable @typescript-eslint/no-explicit-any */
import { cssObj } from '@fuel-ui/css';
import { Icon, Drawer, IconButton, Box, Text } from '@fuel-ui/react';
import { forwardRef } from 'react';
import { APP_VERSION } from '~/config';
import { useOverlay } from '~/systems/Overlay';

import { Menu } from '..';
import { sidebarItems } from '../../constants';
import { ThemeToggler } from '../ThemeToggler';

function SidebarContent() {
  const overlay = useOverlay();

  return (
    <>
      <Box.Flex css={styles.header}>
        <ThemeToggler />
        <IconButton
          autoFocus
          size="sm"
          icon={Icon.is('X')}
          variant="link"
          css={styles.closeBtn}
          aria-label="drawer_closeButton"
          onPress={overlay.close}
        />
      </Box.Flex>
      <Menu items={sidebarItems()} />
      <Box css={styles.version}>
        <Text fontSize="xs" color="intentsBase8">
          Version: {APP_VERSION}{' '}
        </Text>
      </Box>
    </>
  );
}

export const Sidebar = forwardRef<HTMLDivElement>((_props, ref) => {
  const overlay = useOverlay();
  return (
    <Drawer
      isDismissable
      size={230}
      side="right"
      containerRef={ref as any}
      onClose={overlay.close}
      isOpen={overlay.is('sidebar')}
    >
      <Drawer.Content>
        <Drawer.Body css={styles.wrapper}>
          <SidebarContent />
        </Drawer.Body>
      </Drawer.Content>
    </Drawer>
  );
});

const styles = {
  wrapper: cssObj({
    display: 'grid',
    height: '100%',
    gridTemplateRows: '50px 1fr auto',
  }),
  header: cssObj({
    px: '$4',
    alignItems: 'center',
    justifyContent: 'space-between',

    '.fuel_Icon': {
      color: '$intentsBase8',
    },
  }),
  closeBtn: cssObj({
    padding: '$0 !important',
    position: 'initial',
    height: '$4',
    top: '$2',
    right: '$2',
  }),
  version: cssObj({
    padding: '$3 $4',
    textAlign: 'center',
  }),
};
