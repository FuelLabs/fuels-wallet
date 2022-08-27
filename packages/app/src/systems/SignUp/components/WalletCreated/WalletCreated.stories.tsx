import { BoxCentered } from "@fuel-ui/react";

import { WalletCreated } from "./WalletCreated";

export default {
  component: WalletCreated,
  title: "SignUp/Components/WalletCreated",
  parameters: {
    layout: "fullscreen",
  },
};

const ACCOUNT = {
  name: "Account 1",
  address: "fuel0x2c8e117bcfba11c76d7db2d43464b1d2093474ef",
};

export const Usage = () => (
  <BoxCentered minHS>
    <WalletCreated account={ACCOUNT} />
  </BoxCentered>
);
