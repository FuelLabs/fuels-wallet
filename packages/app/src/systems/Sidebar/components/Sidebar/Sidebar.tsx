/* eslint-disable @typescript-eslint/no-explicit-any */
import { cssObj } from '@fuel-ui/css';
import { Icon, Avatar, Drawer, IconButton, Box, Text } from '@fuel-ui/react';
import { forwardRef } from 'react';

import { Menu } from '..';
import { useAccounts } from '../../../Account';
import { useNetworks } from '../../../Network';
import { sidebarItems } from '../../constants';

import { APP_VERSION } from '~/config';
import { useOverlay } from '~/systems/Overlay';

function SidebarContent() {
  const overlay = useOverlay();
  const { handlers: accountHandlers, account } = useAccounts();
  const { selectedNetwork } = useNetworks();

  return (
    <>
      <Box.Flex css={styles.header}>
        <Box.Stack gap="$2" css={styles.accountSelector}>
          <Avatar.Generated
            size="sm"
            hash={account?.address as string}
            css={{ boxShadow: '$sm' }}
          />
          <IconButton
            size="xs"
            variant="link"
            icon={<Icon icon="ChevronDown" size={18} />}
            aria-label="Accounts"
            onClick={accountHandlers.goToList}
            css={{ padding: '$0 !important' }}
          />
        </Box.Stack>
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
      <Menu items={sidebarItems(selectedNetwork?.url)} />
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
      type="menu"
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
    gridTemplateRows: '60px 1fr auto',
  }),
  header: cssObj({
    padding: '$3 $4',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: '1px solid $border',

    '.fuel_Icon': {
      color: '$intentsBase8',
    },
  }),
  accountSelector: cssObj({
    flexDirection: 'row',
    alignItems: 'center',
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
