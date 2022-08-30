import { BoxCentered } from "@fuel-ui/react";

import { SignUpFailed } from "./SignUpFailed";

export default {
  component: SignUpFailed,
  title: "SignUp/Components/SignUpFailed",
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
    <SignUpFailed account={ACCOUNT} />
  </BoxCentered>
);
