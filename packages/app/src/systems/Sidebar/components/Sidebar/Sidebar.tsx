/* eslint-disable @typescript-eslint/no-explicit-any */
import { cssObj } from '@fuel-ui/css';
import { Icon, Avatar, Flex, Drawer, IconButton, Stack } from '@fuel-ui/react';
import { forwardRef } from 'react';

import { Menu, NetworkSelector } from '..';
import { useAccounts } from '../../../Account';
import { NetworkScreen, useNetworks } from '../../../Network';
import { sidebarItems } from '../../constants';

import { useOverlay } from '~/systems/Overlay';

function SidebarContent() {
  const overlay = useOverlay();
  const { handlers: accountHandlers, account } = useAccounts();
  const { networks, selectedNetwork, handlers } = useNetworks({
    type: NetworkScreen.list,
  });

  return (
    <Stack css={styles.wrapper}>
      <Flex css={styles.header}>
        <Stack gap="$2" css={styles.accountSelector}>
          <Avatar.Generated
            size="sm"
            hash={account!.address as string}
            background="fuel"
          />
          <IconButton
            size="xs"
            variant="link"
            color="gray"
            icon={<Icon icon="CaretDown" size={18} />}
            aria-label="Accounts"
            onClick={accountHandlers.goToList}
          />
        </Stack>
        <IconButton
          autoFocus
          size="sm"
          icon={Icon.is('X')}
          variant="link"
          css={styles.closeBtn}
          aria-label="drawer_closeButton"
          onPress={overlay.close}
        />
      </Flex>
      <Menu items={sidebarItems(selectedNetwork?.url)} />
      <Flex css={styles.networkSelector}>
        <NetworkSelector
          onSelectNetwork={handlers.selectNetwork}
          selected={selectedNetwork!}
          networks={networks}
        />
      </Flex>
    </Stack>
  );
}

export const Sidebar = forwardRef<HTMLDivElement>((_props, ref) => {
  const overlay = useOverlay();
  return (
    <Drawer
      type="menu"
      size={220}
      containerRef={ref as any}
      isDismissable
      isOpen={overlay.is('sidebar')}
    >
      <Drawer.Content>
        <SidebarContent />
      </Drawer.Content>
    </Drawer>
  );
});

const styles = {
  wrapper: cssObj({
    flex: 1,
    height: '100%',
  }),
  header: cssObj({
    padding: '$3 $4',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: '1px dashed $gray4',

    '.fuel_icon': {
      color: '$gray8',
    },
  }),
  accountSelector: cssObj({
    flexDirection: 'row',
    alignItems: 'center',
  }),
  networkSelector: cssObj({
    px: '$1',
    alignItems: 'center',
    justifyContent: 'center',
    borderTop: '1px dashed $gray4',
  }),
  sidebarWrapper: cssObj({
    overflow: 'hidden',
    position: 'relative',
    maxWidth: '350px',
    flex: 1,
    maxHeight: '615px',
    borderRadius: '$md',
    w: '100%',
    h: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }),
  closeBtn: cssObj({
    position: 'initial',
    height: '$6',
    padding: '$1',
    top: '$2',
    right: '$2',
  }),
};
