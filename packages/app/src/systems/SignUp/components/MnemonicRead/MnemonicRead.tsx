import { cssObj } from '@fuel-ui/css';
import { Form, Checkbox, Button, Alert, Box } from '@fuel-ui/react';
import { useState } from 'react';

import { useSignUpStepper } from '../../hooks';
import { Header } from '../Header';
import { Stepper } from '../Stepper';

import { Mnemonic } from '~/systems/Core';

export type MnemonicReadProps = {
  words?: string[];
  onNext: () => void;
  onCancel: () => void;
};

export function MnemonicRead({ words, onCancel, onNext }: MnemonicReadProps) {
  const [isSavedChecked, setSavedChecked] = useState(false);
  const { steps, handleChangeStep } = useSignUpStepper();

  return (
    <Box.Stack gap="$6" align="center">
      <Stepper steps={steps} active={2} onStepChange={handleChangeStep} />
      <Header
        title="Write down seed phrase"
        subtitle="Write down your seed phrase in a secure location on a piece of paper."
      />
      <Box.Stack css={styles.content} gap="$6">
        <Mnemonic value={words} type="read" />
        <Alert status="warning">
          <Form.Control css={styles.alertContent}>
            <Form.Label htmlFor="confirmSaved">
              Anyone with access to your recovery phrase could take your assets,
              store it securely. Fuel does not keep a backup of your 12 words.
            </Form.Label>
          </Form.Control>
        </Alert>
        <Form.Control css={{ flexDirection: 'row' }}>
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
            Accept terms and condition
          </Form.Label>
        </Form.Control>
      </Box.Stack>
      <Box css={styles.footer}>
        <Button variant="ghost" onPress={onCancel}>
          Back
        </Button>
        <Button intent="primary" onPress={onNext} isDisabled={!isSavedChecked}>
          Next: Confirm phrase
        </Button>
      </Box>
    </Box.Stack>
  );
}

const styles = {
  content: cssObj({
    width: '$sm',
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
