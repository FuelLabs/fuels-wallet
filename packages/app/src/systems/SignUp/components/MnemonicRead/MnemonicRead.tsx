import { cssObj } from '@fuel-ui/css';
import { Form, Checkbox, Button, Alert, Box } from '@fuel-ui/react';
import { useState } from 'react';

import { Header } from '../Header';

import { ImageLoader, Mnemonic, relativeUrl } from '~/systems/Core';

export type MnemonicReadProps = {
  words?: string[];
  onNext: () => void;
  onCancel: () => void;
};

export function MnemonicRead({ words, onCancel, onNext }: MnemonicReadProps) {
  const [isSavedChecked, setSavedChecked] = useState(false);

  return (
    <Box.Stack gap="$6" align="center">
      <ImageLoader
        src={relativeUrl('/signup-illustration-1.svg')}
        width={129}
        height={116}
        alt="Showing your Mnemonic"
      />
      <Header
        title="Backup your Recovery Phrase"
        subtitle="You will need it on the next step"
      />
      <Box.Stack css={styles.content} gap="$4">
        <Mnemonic value={words} type="read" />
        <Alert status="warning">
          <Form.Control css={{ flexDirection: 'row' }}>
            <Checkbox
              id="confirmSaved"
              aria-label="Confirm Saved"
              checked={isSavedChecked}
              // TODO: this bg property should be fixed inside @fuel-ui
              css={{ background: '$intentsBase3 !important', width: '$7' }}
              onCheckedChange={(e) => {
                setSavedChecked(e as boolean);
              }}
            />
            <Form.Label htmlFor="confirmSaved">
              I have backed up my recovery phrase in a secure place.
            </Form.Label>
          </Form.Control>
        </Alert>
      </Box.Stack>
      <Box.Flex gap="$4">
        <Button
          color="intentsBase"
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
          isDisabled={!isSavedChecked}
        >
          Next
        </Button>
      </Box.Flex>
    </Box.Stack>
  );
}

const styles = {
  content: cssObj({
    width: 400,

    '.fuel_alert--icon': {
      display: 'none',
    },
    '.fuel_alert--content': {
      gap: '$4',
    },
    '.fuel_checkbox:focus-within::after': {
      borderColor: '$intentsWarning5 !important',
    },
  }),
};
