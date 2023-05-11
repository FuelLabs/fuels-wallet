import { cssObj } from '@fuel-ui/css';
import type { Icons } from '@fuel-ui/react';
import { Box, Icon, Menu as RootMenu } from '@fuel-ui/react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate, useResolvedPath, useMatch } from 'react-router-dom';

import { store } from '~/store';
import { coreStyles } from '~/systems/Core/styles';

export type MenuItemObj = {
  key: string;
  icon: Icons;
  label: string;
  path?: string;
  ahref?: string;
  submenu?: MenuItemObj[];
  onPress?: () => void;
};

type MenuItemContentProps = {
  item: MenuItemObj;
  isOpened?: boolean;
};

function commonActions(
  item: MenuItemObj,
  navigate: ReturnType<typeof useNavigate>
) {
  if (item?.onPress) {
    store.closeOverlay();
    item.onPress();
    return;
  }
  if (item?.path) {
    store.closeOverlay();
    navigate(item.path);
    return;
  }
  if (item?.ahref) {
    store.closeOverlay();
    window.open(item.ahref);
  }
}

const MotionRootMenu = motion(RootMenu);

function MenuItemContent({ item, isOpened }: MenuItemContentProps) {
  const navigate = useNavigate();
  const path = useResolvedPath(item.path as string);
  const match = useMatch({
    path: path.pathname,
    end: false,
    caseSensitive: false,
  });

  function handleAction(key: string | number) {
    const subItem = item.submenu?.find((i) => i.key === key);
    if (subItem) {
      commonActions(subItem, navigate);
    }
  }

  return (
    <Box css={styles.routeContent}>
      <Box.Flex
        css={styles.route}
        data-active={Boolean(match && item.path)}
        data-opened={isOpened}
      >
        <Icon icon={item.icon} className="main-icon" aria-label="Menu Icon" />
        <Box css={{ flex: 1 }}>{item.label}</Box>
        {item.submenu && <Icon icon="ChevronDown" aria-label="Caret Icon" />}
      </Box.Flex>
      {isOpened && item.submenu && (
        <MotionRootMenu
          css={styles.submenu}
          onAction={handleAction}
          aria-label="Submenu"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
        >
          {item.submenu.map((subItem) => (
            <RootMenu.Item key={subItem.key} textValue={subItem.label}>
              <Icon icon={subItem.icon} css={{ color: '$intentsBase8' }} />
              {subItem.label}
            </RootMenu.Item>
          ))}
        </MotionRootMenu>
      )}
    </Box>
  );
}

export type MenuProps = {
  items: MenuItemObj[];
};

export function Menu({ items }: MenuProps) {
  const [opened, setOpened] = useState<string | null>(null);
  const navigate = useNavigate();

  function handleAction(key: string | number) {
    const item = items.find((item) => item.key === key);
    if (item?.submenu) {
      setOpened(opened !== item.key ? item.key : null);
      return;
    }
    if (item) {
      commonActions(item, navigate);
    }
  }

  return (
    <RootMenu
      css={styles.root}
      onAction={handleAction}
      aria-label="Sidebar Menu"
    >
      {items.map((item) => {
        const isOpened = opened === item.key;
        return (
          <RootMenu.Item
            key={item.key}
            textValue={item.label}
            data-opened={isOpened}
          >
            <MenuItemContent item={item} isOpened={isOpened} />
          </RootMenu.Item>
        );
      })}
    </RootMenu>
  );
}

const styles = {
  root: cssObj({
    ...coreStyles.scrollable('$intentsBase2'),
    py: '$3',
    flex: 1,

    '& > .fuel_menu-list-item': {
      fontSize: '$sm',
      height: 'auto',
      px: '$3',
    },

    '& > .fuel_menu-list-item:hover, .fuel_menu-list-item:focus': {
      background: '$transparent',
    },
    '& > .fuel_menu-list-item:focus-within': {
      color: '$intentsBase12',
    },
    '& > .fuel_menu-list-item:focus-within .main-icon': {
      color: '$accent11',
    },
  }),
  route: cssObj({
    flex: 1,
    gap: '$2',
    py: '$1',
    px: '$2',
    borderRadius: '$lg',

    '&[data-active="true"]': {
      color: '$intentsBase12',
      bg: '$intentsBase3',
      my: '2px',
    },

    '&[data-opened="true"] .fuel_icon--ChevronDown': {
      transform: 'rotate(180deg)',
    },

    '.fuel_icon, .fuel_icon--ChevronDown': {
      transition: 'transform .3s',
      color: '$intentsBase7',
    },
  }),
  routeContent: cssObj({
    flex: 1,
  }),
  submenu: cssObj({
    position: 'relative',
    fontSize: '$sm',
    py: '$0',
    ml: '$2',

    '&::before': {
      display: 'block',
      content: '""',
      position: 'absolute',
      top: 4,
      left: 7,
      width: 1,
      height: 'calc(100% - 18px)',
      background: '$intentsBase6',
    },

    '.fuel_menu-list-item': {
      position: 'relative',
      py: '2px',
      px: '$0',
      pl: '$2',
      ml: '$4',
      height: 'auto',
      fontSize: '$sm',
      color: '$intentsBase8',
    },

    '.fuel_menu-list-item .fuel_icon': {
      color: '$intentsBase8',
    },

    '.fuel_menu-list-item::before': {
      display: 'block',
      content: '""',
      position: 'absolute',
      top: '50%',
      left: -8,
      width: 10,
      height: 1,
      background: '$intentsBase6',
      transform: 'translateY(-50%)',
    },
  }),
};
