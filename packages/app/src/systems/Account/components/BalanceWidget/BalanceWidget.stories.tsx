import { Box } from "@fuel-ui/react";
import { toBigInt } from "fuels";

import type { BalanceWidgetProps } from "./BalanceWidget";
import { BalanceWidget } from "./BalanceWidget";

export default {
  component: BalanceWidget,
  title: "Account/Components/BalanceWidget",
};

const ACCOUNT = {
  name: "Account 1",
  address: "fuel0x2c8e117bcfba11c76d7db2d43464b1d2093474ef",
  balance: toBigInt("12008943834"),
  balanceSymbol: "$",
};

export const Usage = (args: BalanceWidgetProps) => (
  <Box css={{ width: 320 }}>
    <BalanceWidget {...args} account={ACCOUNT} />
  </Box>
);

export const Hidden = (args: BalanceWidgetProps) => (
  <Box css={{ width: 320 }}>
    <BalanceWidget {...args} account={ACCOUNT} isHidden />
  </Box>
);

export const Loader = () => (
  <Box css={{ width: 320 }}>
    <BalanceWidget.Loader />
  </Box>
);
