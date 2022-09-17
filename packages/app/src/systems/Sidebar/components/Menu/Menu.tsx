/* eslint-disable @typescript-eslint/no-unused-expressions */
import { cssObj } from "@fuel-ui/css";
import type { Icons } from "@fuel-ui/react";
import { Box, Flex, Icon, Menu as RootMenu } from "@fuel-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

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

function MenuItemContent({ item, isOpened }: MenuItemContentProps) {
  const caret = isOpened ? Icon.is("CaretUp") : Icon.is("CaretDown");
  const navigate = useNavigate();

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
    <Flex direction="column" css={styles.menuItemContent}>
      <Flex gap="$3">
        <Icon
          icon={item.icon}
          css={{ color: "$gray8" }}
          className="main-icon"
        />
        <Box css={{ flex: 1 }}>{item.label}</Box>
        {item.submenu && <Icon icon={caret} css={{ color: "$gray8" }} />}
      </Flex>
      <AnimatePresence>
        {item.submenu && isOpened && (
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ ease: "linear", duration: "0.1" }}
          >
            <RootMenu css={styles.submenu} onAction={handleAction}>
              {item.submenu.map((subItem) => (
                <RootMenu.Item key={subItem.key} textValue={subItem.label}>
                  <Icon icon={subItem.icon} css={{ color: "$gray8" }} />
                  {subItem.label}
                </RootMenu.Item>
              ))}
            </RootMenu>
          </motion.div>
        )}
      </AnimatePresence>
    </Flex>
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
      opened !== item.key ? setOpened(item.key) : setOpened(null);
      return;
    }
    if (item?.path) {
      navigate(item.path);
    }
  }

  return (
    <RootMenu onAction={handleAction} css={styles.root}>
      {items.map((item) => (
        <RootMenu.Item key={item.key} textValue={item.label}>
          <MenuItemContent item={item} isOpened={opened === item.key} />
        </RootMenu.Item>
      ))}
    </RootMenu>
  );
}

const styles = {
  root: cssObj({
    ".fuel_menu-list-item": {
      py: "$2",
      height: "auto",
    },
    ".fuel_menu-list-item:hover, .fuel_menu-list-item:focus": {
      background: "$transparent",
    },
    ".fuel_menu-list-item:focus-within": {
      color: "$gray12",
    },
    ".fuel_menu-list-item:focus-within .main-icon": {
      color: "$accent11",
    },
  }),
  menuItemContent: cssObj({
    flex: 1,
  }),
  submenu: cssObj({
    position: "relative",
    fontSize: "$xs",

    "&::before": {
      display: "block",
      content: '""',
      position: "absolute",
      top: 10,
      left: 7,
      width: 1,
      height: "calc(100% - 32px)",
      background: "$gray6",
    },

    ".fuel_menu-list-item": {
      position: "relative",
      py: "2px",
      ml: "$4",
      height: "auto",
    },

    ".fuel_menu-list-item .fuel_icon": {
      color: "$gray8",
    },

    ".fuel_menu-list-item::before": {
      display: "block",
      content: '""',
      position: "absolute",
      top: "50%",
      left: -8,
      width: 10,
      height: 1,
      background: "$gray6",
      transform: "translateY(-50%)",
    },
  }),
};
