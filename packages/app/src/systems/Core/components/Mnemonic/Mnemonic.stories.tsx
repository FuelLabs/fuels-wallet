import { Box } from "@fuel-ui/react";

import type { MnemonicProps } from "./Mnemonic";
import { Mnemonic } from "./Mnemonic";

export default {
  component: Mnemonic,
  title: "Core/Mnemonic",
  parameters: {
    Mnemonic: "fullscreen",
  },
};

const WORDS = [
  "strange",
  "purple",
  "adamant",
  "crayons",
  "entice",
  "fun",
  "eloquent",
  "missiles",
  "milk",
  "ice",
  "cream",
  "apple",
];

export const Read = (args: MnemonicProps) => (
  <Box css={{ width: 320 }}>
    <Mnemonic {...args} value={WORDS} type="read" />
  </Box>
);

Read.parameters = {
  layout: "centered",
};

export const Write = (args: MnemonicProps) => (
  <Box css={{ width: 320 }}>
    <Mnemonic {...args} type="write" />
  </Box>
);

Write.parameters = {
  layout: "centered",
};
