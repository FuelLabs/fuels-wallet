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
    <>
      <Flex css={styles.header}>
        <Stack gap="$2" css={styles.accountSelector}>
          <Avatar.Generated
            size="sm"
            hash={account?.address as string}
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
          selected={selectedNetwork}
          networks={networks}
        />
      </Flex>
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
  closeBtn: cssObj({
    position: 'initial',
    height: '$6',
    padding: '$1',
    top: '$2',
    right: '$2',
  }),
};
