import { cssObj } from '@fuel-ui/css';
import {
  Avatar,
  CardList,
  Dropdown,
  Flex,
  Heading,
  Icon,
  IconButton,
  Switch,
} from '@fuel-ui/react';
import type { Account } from '@fuel-wallet/types';
import type { FC } from 'react';

import { AccountItemLoader } from './AccountItemLoader';

import { FuelAddress } from '~/systems/Account';

export type AccountItemProps = {
  account: Account;
  isToggleChecked?: boolean;
  isCurrent?: boolean;
  isHidden?: boolean;
  onPress?: () => void;
  isDisabled?: boolean;
  compact?: boolean;
  onExport?: (address: string) => void;
  onToggle?: (
    address: string,
    isToggleChecked?: boolean
  ) => Promise<void> | void;
  onUpdate?: (address: string) => Promise<void> | void;
};

type AccountItemComponent = FC<AccountItemProps> & {
  Loader: typeof AccountItemLoader;
};

export const AccountItem: AccountItemComponent = ({
  account,
  isToggleChecked,
  isCurrent,
  isHidden,
  onPress,
  isDisabled,
  compact,
  onExport,
  onToggle,
  onUpdate,
}: AccountItemProps) => {
  if (isHidden) return null;

  function getRightEl() {
    if (onToggle) {
      return (
        <Switch
          size="sm"
          checked={isToggleChecked}
          aria-label={`Toggle ${account.name}`}
          onCheckedChange={() => onToggle?.(account.address, isToggleChecked)}
        />
      );
    }

    const menuItems = [
      onUpdate && (
        <Dropdown.MenuItem key="update" aria-label={`Edit ${account.name}`}>
          <Icon icon={Icon.is('Pencil')} />
          Edit
        </Dropdown.MenuItem>
      ),
      onExport && (
        <Dropdown.MenuItem key="export" aria-label={`Export ${account.name}`}>
          <Icon icon={Icon.is('Key')} />
          Export Private Key
        </Dropdown.MenuItem>
      ),
    ].filter(Boolean) as JSX.Element[];

    if (menuItems.length) {
      return (
        <Dropdown
          popoverProps={{ side: 'bottom', align: 'start', alignOffset: 10 }}
        >
          <Dropdown.Trigger>
            <IconButton
              size="xs"
              variant="link"
              color="gray"
              icon={<Icon icon="DotsThreeOutline" color="gray8" />}
              aria-label={`Account Actions ${account.name}`}
              css={{
                px: '$0',
                color: '$gray10',
              }}
            />
          </Dropdown.Trigger>
          <Dropdown.Menu
            onAction={(action) => {
              if (action === 'update') onUpdate?.(account.address);
              if (action === 'export') onExport?.(account.address);
            }}
          >
            {menuItems}
          </Dropdown.Menu>
        </Dropdown>
      );
    }

    return null;
  }

  return (
    <CardList.Item
      isActive={isCurrent}
      onClick={onPress}
      rightEl={getRightEl()}
      css={styles.root}
      aria-disabled={isDisabled}
      aria-label={account.name}
      data-compact={compact}
    >
      <Avatar.Generated
        size={compact ? 'xsm' : 'md'}
        background="fuel"
        hash={account.address}
      />
      <Flex className="wrapper">
        <Heading as="h6" css={styles.name}>
          {account.name}
        </Heading>
        <FuelAddress address={account.address} css={styles.address} />
      </Flex>
    </CardList.Item>
  );
};

const styles = {
  root: cssObj({
    background: '$whiteA2',

    '&[aria-disabled="true"]': {
      opacity: 0.5,
      cursor: 'default',
    },

    '.wrapper': {
      flexDirection: 'column',
    },

    '&[data-compact="true"]': {
      '.wrapper': {
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'space-between',
      },
      '.fuel_avatar-generated': {
        flexShrink: 0,
      },
    },

    '.fuel_button': {
      px: '$1 !important',
      color: '$gray8',
    },

    '.fuel_button:hover': {
      color: '$gray11',
    },
  }),
  name: cssObj({
    margin: 0,
  }),
  address: cssObj({
    fontSize: '$sm',
    fontWeight: '$semibold',
  }),
};

AccountItem.Loader = AccountItemLoader;
