import { Stack, Form, Checkbox, Flex, Button, Box } from '@fuel-ui/react';
import { useState } from 'react';

import { Header } from '../Header';

import { ImageLoader, Mnemonic, relativeUrl } from '~/systems/Core';

export type MnemonicReadProps = {
  words?: string[];
  onNext: () => void;
  onCancel: () => void;
};

export function MnemonicRead({ words, onCancel, onNext }: MnemonicReadProps) {
  const [isChecked, setChecked] = useState(() => false);

  return (
    <Stack gap="$6" align="center">
      <ImageLoader
        src={relativeUrl('/signup-illustration-1.svg')}
        width={129}
        height={116}
        alt="Showing your Mnemonic"
      />
      <Header
        title="Write down your Recover Phrase"
        subtitle="You will need it on the next step"
      />
      <Box css={{ width: 400 }}>
        <Mnemonic value={words} type="read" />
      </Box>
      <Form.Control css={{ flexDirection: 'row' }}>
        <Checkbox
          id="confirmSaved"
          aria-label="Confirm Saved"
          checked={isChecked}
          onCheckedChange={(e) => {
            setChecked(e as boolean);
          }}
        />
        <Form.Label htmlFor="confirmSaved">
          I saved my passphrase in some secure place
        </Form.Label>
      </Form.Control>
      <Flex gap="$4">
        <Button
          color="gray"
          variant="ghost"
          css={{ width: 130 }}
          onPress={onCancel}
        >
          Cancel
        </Button>
        <Button
          color="accent"
          css={{ width: 130 }}
          onPress={onNext}
          isDisabled={!isChecked}
        >
          Next
        </Button>
      </Flex>
    </Stack>
  );
}
