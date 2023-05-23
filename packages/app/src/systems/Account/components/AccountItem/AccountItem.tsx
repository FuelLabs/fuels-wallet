import { cssObj } from '@fuel-ui/css';
import {
  Avatar,
  Box,
  CardList,
  Dropdown,
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
  onToggleHidden?: (address: string, isHidden: boolean) => void;
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
  onToggleHidden,
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
          <Icon icon={Icon.is('Edit')} />
          Edit
        </Dropdown.MenuItem>
      ),
      onExport && (
        <Dropdown.MenuItem key="export" aria-label={`Export ${account.name}`}>
          <Icon icon={Icon.is('Key')} />
          Export Private Key
        </Dropdown.MenuItem>
      ),
      onToggleHidden && (
        <Dropdown.MenuItem
          key="hide"
          aria-label={`${account.isHidden ? 'Unhide' : 'Hide'} ${account.name}`}
        >
          <Icon icon={Icon.is(account.isHidden ? 'EyeClosed' : 'Eye')} />
          {`${account.isHidden ? 'Unhide' : 'Hide'} Account`}
        </Dropdown.MenuItem>
      ),
    ].filter(Boolean) as JSX.Element[];

    if (menuItems.length) {
      return (
        <Dropdown
          css={{ zIndex: 1 }}
          popoverProps={{
            alignOffset: -20,
            align: 'end',
          }}
        >
          <Dropdown.Trigger>
            <IconButton
              size="xs"
              variant="link"
              icon={<Icon icon="Dots" color="intentsBase8" />}
              aria-label={`Account Actions ${account.name}`}
              css={{ px: '$0', color: '$intentsBase10' }}
            />
          </Dropdown.Trigger>
          <Dropdown.Menu
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onAction={(action: any) => {
              if (action === 'update') onUpdate?.(account.address);
              if (action === 'export') onExport?.(account.address);
              if (action === 'hide')
                onToggleHidden?.(account.address, !account.isHidden);
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
      onClick={account.isHidden ? undefined : onPress}
      rightEl={getRightEl()}
      css={styles.root}
      aria-disabled={isDisabled}
      aria-label={account.name}
      data-compact={compact}
    >
      <Avatar.Generated size={compact ? 'xsm' : 'md'} hash={account.address} />
      <Box.Flex className="wrapper">
        <Heading as="h6" css={styles.name}>
          {account.name}
        </Heading>
        <FuelAddress address={account.address} css={styles.address} />
      </Box.Flex>
    </CardList.Item>
  );
};

const styles = {
  root: cssObj({
    background: '$cardListItemBg',

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
      '.fuel_Avatar-generated': {
        flexShrink: 0,
      },
    },

    '.fuel_Button': {
      px: '$1 !important',
      color: '$intentsBase8',
    },

    '.fuel_Button:hover': {
      color: '$intentsBase11',
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
