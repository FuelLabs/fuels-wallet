import { cssObj } from '@fuel-ui/css';
import {
  Alert,
  Button,
  Checkbox,
  Dialog,
  Form,
  Icon,
  Box,
  Text,
} from '@fuel-ui/react';
import { useState } from 'react';

import { WALLET_HEIGHT, WALLET_WIDTH } from '~/config';

export type ResetDialogProps = {
  children?: React.ReactNode;
  onReset?: () => void;
  isLoading?: boolean;
};

export function ResetDialog({
  isLoading,
  onReset,
  children,
}: ResetDialogProps) {
  const [isSavedChecked, setSavedChecked] = useState(false);

  return (
    <Dialog>
      <Dialog.Trigger>{children}</Dialog.Trigger>
      <Dialog.Content css={styles.content}>
        <Dialog.Close />
        <Dialog.Heading>Forgot password</Dialog.Heading>
        <Dialog.Description as="div" css={styles.description}>
          <Box.Stack gap={'$2'}>
            <Text>
              If you lost your password, the only way to recover your wallet is
              to reset the Fuel Wallet extension, select &quot;I already have a
              wallet&quot; and use your secret Seed Phrase.
            </Text>
            <Text>
              Make sure you have backed up your Seed Phrase before proceeding.
            </Text>
            <Alert status="warning" hideIcon css={styles.alert}>
              <Form.Control css={styles.form}>
                <Checkbox
                  id="confirmReset"
                  aria-label="Confirm Reset"
                  checked={isSavedChecked}
                  onCheckedChange={(e) => {
                    setSavedChecked(e as boolean);
                  }}
                />
                <Form.Label htmlFor="confirmReset">
                  I understand by resetting my wallet I&apos;ll remove all data
                  stored on this device, including my Seed Phrase, accounts,
                  networks and other settings.
                </Form.Label>
              </Form.Control>
            </Alert>
          </Box.Stack>
        </Dialog.Description>
        <Dialog.Footer>
          <Button
            type="submit"
            intent="primary"
            isLoading={isLoading}
            leftIcon={Icon.is('LockOpen')}
            onPress={onReset}
            css={styles.button}
            aria-label="Reset wallet"
          >
            Reset Wallet
          </Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  );
}

const styles = {
  warning: cssObj({
    color: '$intentsBase11',
    fontWeight: '$extrabold',
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
    padding: '$4',
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
  }),
  form: cssObj({
    pl: '$2',
    display: 'grid',
    gridTemplateColumns: 'auto 1fr',
    flexDirection: 'row',
    gap: '$4',
  }),
};
