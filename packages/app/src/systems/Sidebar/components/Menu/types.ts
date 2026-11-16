import type { Icons } from '@fuel-wallet/ui';

export type MenuItemObj = {
  key: string;
  icon: Icons;
  label: string;
  path?: string;
  ahref?: string;
  submenu?: MenuItemObj[];
  onPress?: () => void;
  badge?: boolean;
};

export type MenuItemContentProps = {
  item: MenuItemObj;
  isOpened?: boolean;
};

export type MenuProps = {
  items: MenuItemObj[];
};
