import { cssObj } from '@fuel-ui/css';
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Dialog,
  Form,
  Icon,
  Text,
} from '@fuel-ui/react';
import { useState } from 'react';
import { WALLET_HEIGHT, WALLET_WIDTH } from '~/config';
import { OverlayDialogTopbar, useOverlay } from '~/systems/Overlay';

import { useUnlock } from '../../hooks';

export function ResetDialog() {
  const [isSavedChecked, setSavedChecked] = useState(false);
  const overlay = useOverlay();
  const { isReseting, handlers } = useUnlock();

  return (
    <>
      <OverlayDialogTopbar onClose={overlay.close}>
        Forgot Password
      </OverlayDialogTopbar>
      <Dialog.Description as="div" css={styles.description}>
        <Box.Stack gap="$4">
          <Text>
            If you lost your password, the only way to recover your wallet is to
            reset the Fuel Wallet extension, select &quot;I already have a
            wallet&quot; and use your secret Seed Phrase.
          </Text>
          <Text>
            Make sure you have backed up your Seed Phrase before proceeding.
          </Text>
          <Alert status="warning">
            <Alert.Description>
              By resetting your wallet you will remove all data stored on this
              device, including Seed Phrase, accounts,
            </Alert.Description>
          </Alert>
          <Form.Control css={{ flexDirection: 'row' }}>
            <Checkbox
              id="confirmReset"
              aria-label="Confirm Reset"
              checked={isSavedChecked}
              onCheckedChange={(e) => {
                setSavedChecked(e as boolean);
              }}
            />
            <Form.Label htmlFor="confirmReset">
              I understand the risks
            </Form.Label>
          </Form.Control>
        </Box.Stack>
      </Dialog.Description>
      <Dialog.Footer>
        <Button
          type="submit"
          intent="primary"
          isDisabled={!isSavedChecked}
          isLoading={isReseting}
          leftIcon={Icon.is('LockOpen')}
          onPress={handlers.reset}
          css={styles.button}
          aria-label="Reset wallet"
        >
          Reset Wallet
        </Button>
      </Dialog.Footer>
    </>
  );
}

const styles = {
  warning: cssObj({
    color: '$intentsBase11',
  }),
  headingIcon: cssObj({
    marginRight: '$3',
  }),
  alert: cssObj({
    mt: '$2',
    py: '$2',
    pr: '$2',
    background: '$intentsBase2',
  }),
  button: cssObj({
    width: '100%',
  }),
  content: cssObj({
    width: WALLET_WIDTH,
    height: WALLET_HEIGHT,
    maxWidth: WALLET_WIDTH,
    maxHeight: 'none',
    background: '$bodyColor',
    borderRadius: '$default',
    boxSizing: 'border-box',
  }),
  description: cssObj({
    flex: 1,
    flexDirection: 'column',
    display: 'flex',
    px: '$4',
  }),
  form: cssObj({
    pl: '$2',
    display: 'grid',
    gridTemplateColumns: 'auto 1fr',
    flexDirection: 'row',
    gap: '$4',
  }),
};
