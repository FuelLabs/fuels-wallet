import { cssObj, cx } from '@fuel-ui/css';
import { Button, Flex, Icon, List } from '@fuel-ui/react';
import { useRouter } from 'next/router';
import { useState } from 'react';

import type { SidebarLinkItem } from '../types';

import { SidebarLink } from './SidebarLink';

type SidebarSubmenuProps = SidebarLinkItem;

export function SidebarSubmenu({
  label,
  submenu,
  subpath,
}: SidebarSubmenuProps) {
  const [isOpened, setIsOpened] = useState(false);
  const { asPath } = useRouter();

  function toggle() {
    setIsOpened((s) => !s);
  }

  return (
    <Flex css={styles.root}>
      <Button
        variant="link"
        rightIcon={isOpened ? Icon.is('CaretUp') : Icon.is('CaretDown')}
        onPress={toggle}
        className={cx({ active: asPath.startsWith(subpath!) })}
      >
        {label}
      </Button>
      {isOpened && (
        <List>
          {submenu?.map((item) => (
            <List.Item key={item.slug} icon={Icon.is('Minus')}>
              <SidebarLink item={item} />
            </List.Item>
          ))}
        </List>
      )}
    </Flex>
  );
}

const styles = {
  root: cssObj({
    flexDirection: 'column',

    '.fuel_button': {
      padding: '$0',
      justifyContent: 'space-between',
      color: '$gray8',
      fontWeight: '$normal',
    },
    '.fuel_button:focus': {
      outline: 'none',
    },
    '.fuel_button.active': {
      color: '$gray11',
    },

    '.fuel_list': {
      display: 'flex',
      flexDirection: 'column',
      mt: '$2',
      gap: '$1',
    },
  }),
};
