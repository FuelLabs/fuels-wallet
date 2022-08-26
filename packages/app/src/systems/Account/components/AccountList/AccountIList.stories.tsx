import { Box } from "@fuel-ui/react";

import type { AccountListProps } from "./AccountList";
import { AccountList } from "./AccountList";

export default {
  component: AccountList,
  title: "Account/AccountList",
};

const ACCOUNTS = [
  {
    name: "Account 1",
    address: "fuel0x2c8e117bcfba11c76d7db2d43464b1d2093474ef",
  },
  {
    name: "Account 2",
    address: "fuel0x2c8e117bcfba11c76d7db2d43464b1d20934734r",
  },
  {
    name: "Account 3",
    address: "fuel0x2c8e117bcfba11c76d7db2d43464b1d209347123",
    isHidden: true,
  },
];

export const Usage = (args: AccountListProps) => (
  <Box css={{ width: 320 }}>
    <AccountList {...args} accounts={ACCOUNTS} />
  </Box>
);
