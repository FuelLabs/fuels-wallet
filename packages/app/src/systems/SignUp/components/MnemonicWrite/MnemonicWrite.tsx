import { Image, Stack, Flex, Button, Box } from "@fuel-ui/react";
import { useState } from "react";

import { Header } from "../Header";

import { Mnemonic } from "~/systems/Core";

export type MnemonicWriteProps = {
  onFilled: (words: string[]) => void;
  onNext: () => void;
  onCancel: () => void;
};

export function MnemonicWrite({
  onFilled,
  onCancel,
  onNext,
}: MnemonicWriteProps) {
  const [isFilled, setFilled] = useState(false);

  function handleFill(val: string[]) {
    setFilled(true);
    onFilled(val);
  }

  return (
    <Stack gap="$6" align="center">
      <Image src="/signup-illustration-1.svg" />
      <Header
        title="Write down your Recover Phrase "
        subtitle="You will need it on the next step"
      />
      <Box css={{ width: 400 }}>
        <Mnemonic type="write" onFilled={handleFill} />
      </Box>
      <Flex gap="$4">
        <Button
          size="sm"
          color="gray"
          variant="ghost"
          css={{ width: 130 }}
          onPress={onCancel}
        >
          Cancel
        </Button>
        <Button
          size="sm"
          color="accent"
          css={{ width: 130 }}
          onPress={onNext}
          isDisabled={!isFilled}
        >
          Next
        </Button>
      </Flex>
    </Stack>
  );
}
