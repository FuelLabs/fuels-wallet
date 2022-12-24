import { cssObj } from '@fuel-ui/css';
import { Avatar, CardList, Flex, Heading, Text } from '@fuel-ui/react';
import type { Account } from '@fuel-wallet/types';
import type { FC } from 'react';

import { AccountItemLoader } from './AccountItemLoader';

import { shortAddress } from '~/systems/Core';

export type AccountItemProps = {
  account: Account;
  isSelected?: boolean;
  isHidden?: boolean;
  onPress?: () => void;
};

type AccountItemComponent = FC<AccountItemProps> & {
  Loader: typeof AccountItemLoader;
};

export const AccountItem: AccountItemComponent = ({
  account,
  isSelected,
  isHidden,
  onPress,
}) => {
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
      isActive={isSelected}
      onClick={onPress}
      aria-label={account.name}
    >
      <Avatar.Generated size="md" background="fuel" hash={account.address} />
      <Flex direction="column">
        <Heading as="h6" css={styles.name}>
          {account.name}
        </Heading>
        <Text css={styles.address}>{shortAddress(account.address)}</Text>
      </Flex>
    </CardList.Item>
  );
};

AccountItem.Loader = AccountItemLoader;

const styles = {
  name: cssObj({
    margin: 0,
  }),
  address: cssObj({
    textSize: 'sm',
    fontWeight: '$semibold',
  }),
};
