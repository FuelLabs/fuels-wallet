import { Box } from "@fuel-ui/react";

import type { AccountItemProps } from "./AccountItem";
import { AccountItem } from "./AccountItem";

export default {
  component: AccountItem,
  title: "Account/AccountItem",
};

const ACCOUNT = {
  name: "Account 1",
  address: "fuel0x2c8e117bcfba11c76d7db2d43464b1d2093474ef",
};

export const Usage = (args: AccountItemProps) => (
  <Box css={{ width: 320 }}>
    <AccountItem {...args} account={ACCOUNT} />
  </Box>
);

export const Selected = (args: AccountItemProps) => (
  <Box css={{ width: 320 }}>
    <AccountItem {...args} account={ACCOUNT} isSelected />
  </Box>
);
