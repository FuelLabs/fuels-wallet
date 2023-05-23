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
    <Box.Stack gap="$4" align="center">
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
        <Alert status="warning" hideIcon>
          <Form.Control css={{ flexDirection: 'row' }}>
            <Checkbox
              id="confirmSaved"
              aria-label="Confirm Saved"
              checked={isSavedChecked}
              // TODO: this bg property should be fixed inside @fuel-ui
              css={styles.checkbox}
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
      <Box css={styles.footer}>
        <Button variant="ghost" css={{ width: 130 }} onPress={onCancel}>
          Cancel
        </Button>
        <Button
          intent="primary"
          css={{ width: 130 }}
          onPress={onNext}
          isDisabled={!isSavedChecked}
        >
          Next
        </Button>
      </Box>
    </Box.Stack>
  );
}

const styles = {
  content: cssObj({
    width: 400,

    '.fuel_Alert-icon': {
      display: 'none',
    },
    '.fuel_Alert-content': {
      gap: '$4',
    },
    '.fuel_checkbox:focus-within::after': {
      borderColor: '$intentsWarning5 !important',
    },
  }),
  checkbox: cssObj({
    bg: '$semanticGhostWarningBg',
    borderColor: '$semanticGhostWarningHoverBorder',
    width: '$7',

    '&[data-state="checked"]': {
      bg: '$semanticGhostWarningHoverBg',
      borderColor: '$semanticGhostWarningHoverBorder',
    },

    '&:focus-within': {
      outline: '2px solid $semanticGhostWarningHoverBorder',
    },
  }),
  footer: cssObj({
    width: 'calc(100% - $4)',
    display: 'flex',
    gridTemplateColumns: '1fr 1fr',
    gap: '$4',

    button: {
      width: '100%',
    },
  }),
};
