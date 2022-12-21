import { Avatar, CardList, Flex, Heading, Text } from '@fuel-ui/react';
import type { Account } from '@fuel-wallet/types';

import { shortAddress } from '~/systems/Core';

export type AccountItemProps = {
  account: Account;
  isSelected?: boolean;
  isHidden?: boolean;
  onPress?: () => void;
};

export function AccountItem({
  account,
  isSelected,
  isHidden,
  onPress,
}: AccountItemProps) {
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
        <Heading as="h5" css={{ margin: 0 }}>
          {account.name}
        </Heading>
        <Text fontSize="xs">{shortAddress(account.address)}</Text>
      </Flex>
    </CardList.Item>
  );
}
