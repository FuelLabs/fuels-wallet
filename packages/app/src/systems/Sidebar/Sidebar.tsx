import { cssObj } from '@fuel-ui/css';
import { Icon, Box, Avatar, Flex, Drawer } from '@fuel-ui/react';

import { useAccount } from '../Account';
import type { Network } from '../Network';
import { NetworkScreen, useNetworks } from '../Network';

import type { MenuItemObj } from './components';
import { Menu, NetworkSelector } from './components';
import { sidebarItems } from './constants';

export function Sidebar() {
  const { account } = useAccount();

  const { networks, selectedNetwork } = useNetworks({
    type: NetworkScreen.list,
  });
  return (
    <Flex css={styles.wrapper}>
      <Flex css={styles.column}>
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

            <Icon icon="CaretDown" size={18}></Icon>
          </Flex>
          <Drawer.CloseButton
            css={{ position: 'unset' }}
            data-testid="drawer_closeButton"
            aria-label="drawer_closeButton"
          />
        </Flex>

        <Menu items={sidebarItems as MenuItemObj[]} />
      </Flex>
      <Flex
        css={{
          ...styles.bottomBorder,
          ...styles.separator,
        }}
      >
        <NetworkSelector
          selected={selectedNetwork as Network}
          networks={networks}
        />
      </Flex>
    </Flex>
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
    height: 'flex',
    flexDirection: 'column',
  }),
  bottomBorder: cssObj({
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 'thin',
    borderTopStyle: 'dashed',
    mt: '$4',
  }),
  accountDropdownWrapper: cssObj({
    flexDirection: 'row',
    alignItems: 'center',
    gap: '$2',
  }),
  topBorder: cssObj({
    padding: '$2',
    py: '$3',
    justifyContent: 'space-between',
    flex: 1,
    borderBottomWidth: 'thin',
    borderBottomStyle: 'dashed',
  }),
  column: cssObj({ flex: 1, flexDirection: 'column' }),
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
