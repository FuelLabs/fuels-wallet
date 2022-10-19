import { cssObj } from '@fuel-ui/css';
import type { Icons } from '@fuel-ui/react';
import { Box, Flex, Icon, Menu as RootMenu } from '@fuel-ui/react';
import { AnimatePresence, motion, MotionConfig } from 'framer-motion';
import { useState } from 'react';
import { useNavigate, useResolvedPath, useMatch } from 'react-router-dom';

export type MenuItemObj = {
  key: string;
  icon: Icons;
  label: string;
  path?: string;
  ahref?: string;
  submenu?: MenuItemObj[];
};

type MenuItemContentProps = {
  item: MenuItemObj;
  isOpened?: boolean;
};

const FlexMotion = motion(Flex);
const IconMotion = motion(Icon);

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
    if (subItem?.path) {
      navigate(subItem.path);
    }
    if (subItem?.ahref) {
      window.open(subItem.ahref);
    }
  }

  return (
    <MotionConfig transition={{ ease: 'linear', duration: 0.2 }}>
      <FlexMotion
        direction="column"
        css={styles.menuItemContent(Boolean(isOpened))}
        animate={{ height: isOpened ? '100%' : '24px' }}
      >
        <Flex
          css={match && item.path ? styles.activeRoute : styles.route}
          gap="$3"
        >
          <Icon
            icon={item.icon}
            css={{
              color: match && item.path ? '$accent11' : '$gray8',
            }}
            className="main-icon"
          />
          <Box css={{ flex: 1 }}>{item.label}</Box>
          {item.submenu && (
            <IconMotion
              icon="CaretDown"
              css={{ color: match && item.path ? '$white' : '$gray8' }}
              animate={{ rotate: isOpened ? '180deg' : '0deg' }}
            />
          )}
        </Flex>
        <AnimatePresence mode="wait" initial={false}>
          {isOpened && item.submenu && (
            <Box css={{ overflow: 'hidden' }}>
              <motion.div
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
              >
                <RootMenu
                  css={styles.submenu}
                  onAction={handleAction}
                  aria-label="Submenu"
                >
                  {item.submenu.map((subItem) => (
                    <RootMenu.Item key={subItem.key} textValue={subItem.label}>
                      <Icon icon={subItem.icon} css={{ color: '$gray8' }} />
                      {subItem.label}
                    </RootMenu.Item>
                  ))}
                </RootMenu>
              </motion.div>
            </Box>
          )}
        </AnimatePresence>
      </FlexMotion>
    </MotionConfig>
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
    } else if (item?.path) {
      navigate(item.path);
    }
  }

  return (
    <RootMenu
      onAction={handleAction}
      css={styles.root}
      aria-label="Sidebar Menu"
    >
      {items.map((item) => (
        <RootMenu.Item key={item.key} textValue={item.label}>
          <MenuItemContent item={item} isOpened={opened === item.key} />
        </RootMenu.Item>
      ))}
    </RootMenu>
  );
}

const styles = {
  route: cssObj({ p: '5px', px: '10px', borderRadius: 10 }),
  activeRoute: cssObj({
    bg: '$gray3',
    p: '5px',
    px: '10px',
    borderRadius: 10,
  }),
  root: cssObj({
    '.fuel_menu-list-item': {
      py: '$0',
      height: 'auto',
    },
    '.fuel_menu-list-item:hover, .fuel_menu-list-item:focus': {
      background: '$transparent',
    },
    '.fuel_menu-list-item:focus-within': {
      color: '$gray12',
    },
    '.fuel_menu-list-item:focus-within .main-icon': {
      color: '$accent11',
    },
  }),
  menuItemContent: (opened: boolean) => {
    return cssObj({
      transition: 'all',
      flex: 1,
      py: '$2',
      ...(opened && { pb: '$0' }),
    });
  },
  submenu: cssObj({
    position: 'relative',
    fontSize: '$xs',
    pb: '$0',
    pt: '$2',

    '&::before': {
      display: 'block',
      content: '""',
      position: 'absolute',
      top: 10,
      left: 7,
      width: 1,
      height: 'calc(100% - 24px)',
      background: '$gray6',
    },

    '.fuel_menu-list-item': {
      position: 'relative',
      py: '2px',
      ml: '$4',
      height: 'auto',
    },

    '.fuel_menu-list-item .fuel_icon': {
      color: '$gray8',
    },

    '.fuel_menu-list-item::before': {
      display: 'block',
      content: '""',
      position: 'absolute',
      top: '50%',
      left: -8,
      width: 10,
      height: 1,
      background: '$gray6',
      transform: 'translateY(-50%)',
    },
  }),
};
