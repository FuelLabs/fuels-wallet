import { cssObj } from '@fuel-ui/css';
import {
  Avatar,
  CardList,
  Copyable,
  Flex,
  Heading,
  Text,
} from '@fuel-ui/react';
import type { Account } from '@fuel-wallet/types';
import type { FC } from 'react';

import { AccountItemLoader } from './AccountItemLoader';

import { shortAddress } from '~/systems/Core';

export type AccountItemProps = {
  account: Account;
  isCurrent?: boolean;
  isHidden?: boolean;
  onPress?: () => void;
  rightEl?: JSX.Element;
  isDisabled?: boolean;
  compact?: boolean;
};

type AccountItemComponent = FC<AccountItemProps> & {
  Loader: typeof AccountItemLoader;
};

export const AccountItem: AccountItemComponent = ({
  account,
  isCurrent,
  isHidden,
  onPress,
  rightEl,
  isDisabled,
  compact,
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
  return (
    <CardList.Item
      isActive={isCurrent}
      onClick={onPress}
      rightEl={rightEl}
      css={styles.root}
      aria-disabled={isDisabled}
      aria-label={account.name}
      data-compact={compact}
    >
      <Avatar.Generated
        size={compact ? 'xsm' : 'md'}
        background="$gray3"
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
      '.fuel_avatar-generated': {
        flexShrink: 0,
      },
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
