import { cssObj, cx } from '@fuel-ui/css';
import { Box, Button, Icon, List } from '@fuel-ui/react';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import type { SidebarLinkItem } from '~/src/types';

import { SidebarLink } from './SidebarLink';

type SidebarSubmenuProps = SidebarLinkItem;

export function SidebarSubmenu({
  label,
  submenu,
  subpath,
}: SidebarSubmenuProps) {
  const pathname = usePathname();
  const isActive = pathname?.startsWith(`/docs/${subpath}`);
  const [isOpened, setIsOpened] = useState(true);

  function toggle() {
    setIsOpened((s) => !s);
  }

  return (
    <Box.Flex css={styles.root}>
      <Button
        variant="link"
        rightIcon={isOpened ? Icon.is('ChevronUp') : Icon.is('ChevronDown')}
        onPress={toggle}
        className={cx({ active: isActive })}
      >
        {label}
      </Button>
      {isOpened && (
        <List>
          {submenu?.map((item) => (
            <List.Item
              key={item.slug}
              icon={Icon.is('ArrowRight')}
              iconSize={10}
              iconColor="intentsBase6"
            >
              <SidebarLink item={item} />
            </List.Item>
          ))}
        </List>
      )}
    </Box.Flex>
  );
}

const styles = {
  root: cssObj({
    px: '$2',
    mt: '$2',
    flexDirection: 'column',

    '.fuel_Button': {
      padding: '$0',
      justifyContent: 'space-between',
      color: '$intentsBase10',
      fontWeight: '$normal',
    },
    '.fuel_Button:focus': {
      outline: 'none',
      color: '$intentsBase12',
    },
    '.fuel_Button.active': {
      color: '$intentsBase12',
    },
    '.fuel_Button:hover': {
      color: '$intentsBase11',
      textDecoration: 'none',
    },

    '.fuel_List': {
      display: 'flex',
      flexDirection: 'column',
      gap: '$1',
      mt: '$2',
    },
    '.fuel_ListItem': {
      gap: '$2',
    },
    '.fuel_ListItem a': {
      flex: 1,
    },
  }),
};
