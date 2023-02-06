import { cssObj } from '@fuel-ui/css';
import {
  Icon,
  Box,
  Avatar,
  Flex,
  Drawer,
  IconButton,
  Stack,
} from '@fuel-ui/react';

import { Menu, NetworkSelector } from '..';
import { useAccounts } from '../../../Account';
import { NetworkScreen, useNetworks } from '../../../Network';
import { sidebarItems } from '../../constants';

export function Sidebar() {
  const { networks, selectedNetwork, handlers } = useNetworks({
    type: NetworkScreen.list,
  });

  const { handlers: accountHandlers, account } = useAccounts();

  return (
    <Stack css={styles.wrapper} gap={0}>
      <Flex
        css={{
          ...styles.topBorder,
          ...styles.separator,
        }}
      >
        <Flex css={styles.accountDropdownWrapper}>
          <Box css={styles.avatarWrapper}>
            <Avatar.Generated size={'sm'} hash={account?.address as string} />
          </Box>
          <IconButton
            size="xs"
            variant="link"
            color="gray"
            icon={<Icon icon="CaretDown" size={18} />}
            aria-label="Accounts"
            onClick={accountHandlers.goToList}
          />
        </Flex>
        <Drawer.CloseButton
          css={{ position: 'unset' }}
          aria-label="drawer_closeButton"
        />
      </Flex>
      <Menu items={sidebarItems(selectedNetwork?.url)} />
      <Flex
        css={{
          ...styles.bottomBorder,
          ...styles.separator,
        }}
      >
        <NetworkSelector
          onSelectNetwork={handlers.selectNetwork}
          selected={selectedNetwork!}
          networks={networks}
        />
      </Flex>
    </Stack>
  );
}

const styles = {
  separator: cssObj({
    borderColor: '$gray4',
  }),
  avatarWrapper: cssObj({
    borderRadius: '$full',
    background: '$accent11',
  }),
  wrapper: cssObj({
    flex: 1,
    height: '100%',
  }),
  bottomBorder: cssObj({
    flex: 'none',
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 'thin',
    borderTopStyle: 'dashed',
    px: '$1',
  }),
  accountDropdownWrapper: cssObj({
    flexDirection: 'row',
    alignItems: 'center',
    gap: '$2',
  }),
  topBorder: cssObj({
    padding: '$4',
    py: '$3',
    justifyContent: 'space-between',
    flex: 'none',
    borderBottomWidth: 'thin',
    borderBottomStyle: 'dashed',
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
};
