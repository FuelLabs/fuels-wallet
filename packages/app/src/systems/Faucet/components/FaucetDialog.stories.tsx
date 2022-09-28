import { Box } from "@fuel-ui/react";
import type { FunctionComponent } from "react";

import { FaucetDialog } from "./FaucetDialog";

import { GlobalMachinesProvider } from "~/systems/Global";

export default {
  component: FaucetDialog,
  title: "Faucet/Components/FaucetDialog",
  decorators: [
    (Story: FunctionComponent) => (
      <GlobalMachinesProvider>
        <Story />
      </GlobalMachinesProvider>
    ),
  ],
};

export const Usage = () => (
  <Box css={{ width: 300 }}>
    <FaucetDialog />
  </Box>
);
