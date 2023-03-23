import { cssObj } from '@fuel-ui/css';
import {
  Avatar,
  CardList,
  Copyable,
  Dropdown,
  Flex,
  Heading,
  Icon,
  IconButton,
  Switch,
  Text,
} from '@fuel-ui/react';
import type { Account } from '@fuel-wallet/types';
import type { FC } from 'react';

import { AccountItemLoader } from './AccountItemLoader';

import { shortAddress } from '~/systems/Core';

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
        <Dropdown.MenuItem key="update">
          <Icon icon={Icon.is('Pencil')} />
          Edit
        </Dropdown.MenuItem>
      ),
      onExport && (
        <Dropdown.MenuItem key="export">
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
              aria-label="Action"
              css={{
                px: '$0',
                color: '$gray10',
              }}
            />
          </Dropdown.Trigger>
          <Dropdown.Menu
            aria-label="Account Actions"
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
        <Copyable value={account.address}>
          <Text css={styles.address}>{shortAddress(account.address)}</Text>
        </Copyable>
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
    textSize: 'sm',
    fontWeight: '$semibold',
  }),
};

AccountItem.Loader = AccountItemLoader;
