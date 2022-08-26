import {
  Avatar,
  CardList,
  Flex,
  Heading,
  Icon,
  IconButton,
  Text,
} from "@fuel-ui/react";

import type { Account } from "~/systems/Account";
import { shortAddress } from "~/systems/Core";

export type AccountItemProps = {
  account: Account;
  isSelected?: boolean;
  isHidden?: boolean;
};

export function AccountItem({
  account,
  isSelected,
  isHidden,
}: AccountItemProps) {
  if (isHidden) return null;
  /**
   * TODO: add DropdownMenu here with actions after it's done on @fuel-ui
   */
  const rightEl = (
    <IconButton
      size="xs"
      variant="link"
      color="gray"
      icon={<Icon icon="DotsThreeOutline" color="gray8" />}
      aria-label="Action"
      css={{
        px: "$0",
        color: "$gray10",
      }}
    />
  );
  return (
    <CardList.Item isActive={isSelected} rightEl={rightEl}>
      <Avatar
        size="md"
        name={account.name}
        /**
         * TODO: Need to add Avatar.Generated here when it's done on @fuel-ui
         */
        src="https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?&w=128&h=128&dpr=2&q=80"
      />
      <Flex direction="column">
        <Heading as="h5" css={{ margin: 0 }}>
          {account.name}
        </Heading>
        <Text fontSize="xs">{shortAddress(account.address)}</Text>
      </Flex>
    </CardList.Item>
  );
}
