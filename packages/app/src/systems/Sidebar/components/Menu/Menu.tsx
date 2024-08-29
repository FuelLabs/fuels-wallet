import { cssObj } from '@fuel-ui/css';
import { Badge, Box, Icon, Menu as RootMenu, Text } from '@fuel-ui/react';
import { motion } from 'framer-motion';
import type { Key } from 'react';
import { memo, useState } from 'react';
import { useMatch, useNavigate, useResolvedPath } from 'react-router-dom';
import { store } from '~/store';
import { coreStyles } from '~/systems/Core/styles';
import type { MenuItemContentProps, MenuItemObj, MenuProps } from './types';

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

  function handleAction(key: Key) {
    const subItem = item.submenu?.find((i) => i.key === key);
    if (subItem) {
      commonActions(subItem, navigate);
    }
  }

  return (
    <Box css={styles.routeContent}>
      {item.badge && <Text css={styles.badge}>●</Text>}
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

function _Menu({ items }: MenuProps) {
  const [opened, setOpened] = useState<string | null>(null);
  const navigate = useNavigate();

  function handleAction(key: Key) {
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

export const Menu = memo(_Menu);

const styles = {
  root: cssObj({
    ...coreStyles.scrollable('$intentsBase2'),
    pt: '$0',
    pb: '$3',
    flex: 1,

    '& > .fuel_MenuListItem': {
      fontSize: '$sm',
      px: '$3',
    },

    '& .fuel_MenuListItem:not([aria-disabled="true"]):hover, .fuel_MenuListItem:not([aria-disabled="true"]):focus':
      {
        background: 'transparent',
      },
    '& > .fuel_MenuListItem:focus-within': {
      background: 'transparent',
      color: '$intentsBase12',
    },
    '& > .fuel_MenuListItem:focus-within .main-icon': {
      color: '$brand',
    },

    '& li[data-key="settings"]': {
      mt: '$8',
    },
  }),
  route: cssObj({
    flex: 1,
    gap: '$2',
    py: '$1',
    px: '$2',
    borderRadius: '$default',

    '&[data-active="true"]': {
      color: '$textHeading',
      bg: '$intentsBase3',
      my: '2px',
    },

    '&[data-opened="true"] .fuel_Icon--ChevronDown': {
      transform: 'rotate(180deg)',
    },

    '.fuel_Icon, .fuel_Icon--ChevronDown': {
      transition: 'transform .3s',
      color: '$textIcon',
    },
  }),
  routeContent: cssObj({
    flex: 1,
    position: 'relative',
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

    '.fuel_MenuListItem': {
      position: 'relative',
      px: '$0',
      pl: '$2',
      ml: '$4',
      fontSize: '$sm',
      color: '$textColor',
    },

    '.fuel_MenuListItem .fuel_Icon': {
      color: '$textColor',
    },

    '.fuel_MenuListItem::before': {
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
  badge: cssObj({
    position: 'absolute',
    top: 2,
    left: 2,
    fontSize: 8,
    color: '$intentsError10 !important',
    transform: 'translate(25%, -25%)',
  }),
};
