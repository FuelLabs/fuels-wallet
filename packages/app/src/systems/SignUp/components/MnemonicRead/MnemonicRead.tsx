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
        title="Backup Seed Phrase"
        subtitle="You will need this in the next step"
      />
      <Box.Stack css={styles.content} gap="$6">
        <Mnemonic value={words} type="read" />
        <Alert status="warning" hideIcon>
          <Form.Control css={styles.alertContent}>
            <Checkbox
              id="confirmSaved"
              aria-label="Confirm Saved"
              checked={isSavedChecked}
              // TODO: this bg property should be fixed inside @fuel-ui
              onCheckedChange={(e) => {
                setSavedChecked(e as boolean);
              }}
            />
            <Form.Label htmlFor="confirmSaved">
              I have backed up my Seed Phrase securely.
            </Form.Label>
          </Form.Control>
        </Alert>
      </Box.Stack>
      <Box css={styles.footer}>
        <Button variant="ghost" onPress={onCancel}>
          Back
        </Button>
        <Button intent="primary" onPress={onNext} isDisabled={!isSavedChecked}>
          Go to Confirm
        </Button>
      </Box>
    </Box.Stack>
  );
}

const styles = {
  content: cssObj({
    width: 450,

    '.fuel_Alert-content .fuel_FormLabel': {
      color: '$semanticGhostWarningColor',
    },
  }),
  alertContent: cssObj({
    flexDirection: 'row',
    gap: '$4',
  }),
  footer: cssObj({
    width: '$full',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gridGap: '$4',

    button: {
      width: '100%',
    },
  }),
};
