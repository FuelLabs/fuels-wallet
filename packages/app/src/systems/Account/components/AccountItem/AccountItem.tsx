import { cssObj } from '@fuel-ui/css';
import {
  Avatar,
  CardList,
  Copyable,
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
  /**
   * TODO: add DropdownMenu here with actions after it's done on @fuel-ui
   */
  // const rightEl = (
  //   <IconButton
  //     size="xs"
  //     variant="link"
  //     color="gray"
  //     icon={<Icon icon="DotsThreeOutline" color="gray8" />}
  //     aria-label="Action"
  //     css={{
  //       px: '$0',
  //       color: '$gray10',
  //     }}
  //   />
  // );
  const actions = (
    <Flex gap="$2">
      {onUpdate && (
        <IconButton
          variant="link"
          icon={<Icon icon={Icon.is('Pencil')} />}
          aria-label="Update"
          onPress={() => onUpdate?.(account.address)}
        />
      )}
      {onToggle && (
        <Switch
          size="sm"
          checked={isToggleChecked}
          aria-label={`Toggle ${account.name}`}
          onCheckedChange={() => onToggle?.(account.address, isToggleChecked)}
        />
      )}
      {onExport && (
        <IconButton
          variant="link"
          icon={<Icon icon={Icon.is('Key')} />}
          aria-label={`Export ${account.name}`}
          onPress={() => onExport?.(account.address)}
        />
      )}
    </Flex>
  );

  return (
    <CardList.Item
      isActive={isCurrent}
      onClick={onPress}
      rightEl={actions}
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
