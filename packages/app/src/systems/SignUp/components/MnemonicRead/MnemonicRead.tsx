import { cssObj } from '@fuel-ui/css';
import { Alert, Box, Button, Checkbox, Form } from '@fuel-ui/react';
import { useState } from 'react';
import { Mnemonic, MotionStack, animations } from '~/systems/Core';

import { useSignUpStepper } from '../../hooks';
import { Header } from '../Header';
import { Stepper } from '../Stepper';

export type MnemonicReadProps = {
  words?: string[];
  step: number;
  onNext: () => void;
  onCancel: () => void;
};

export function MnemonicRead({
  words,
  step,
  onCancel,
  onNext,
}: MnemonicReadProps) {
  const [isSavedChecked, setSavedChecked] = useState(false);
  const { steps } = useSignUpStepper();

  return (
    <Box.Stack gap="$6" align="center">
      <Stepper steps={steps} active={step} />
      <MotionStack {...animations.slideInRight()} gap="$6">
        <Header
          title="Write down seed phrase"
          subtitle="Write down your seed phrase in a secure location on a piece of paper."
        />
        <Box.Stack css={styles.content} gap="$6">
          <Mnemonic value={words} type="read" />
          <Alert status="warning">
            <Alert.Description>
              Anyone with access to your recovery phrase could take your assets,
              store it securely. Fuel does not keep a backup of your 12 words.
            </Alert.Description>
          </Alert>
          <Form.Control css={{ flexDirection: 'row' }}>
            <Checkbox
              id="confirmSaved"
              aria-label="Confirm Saved"
              checked={isSavedChecked}
              onCheckedChange={(e) => {
                setSavedChecked(e as boolean);
              }}
            />
            <Form.Label htmlFor="confirmSaved">
              I have written down my seed phrase on a piece of paper
            </Form.Label>
          </Form.Control>
        </Box.Stack>
        <Box css={styles.footer}>
          <Button variant="ghost" onPress={onCancel}>
            Back
          </Button>
          <Button
            intent="primary"
            onPress={onNext}
            isDisabled={!isSavedChecked}
          >
            Next: Confirm phrase
          </Button>
        </Box>
      </MotionStack>
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
