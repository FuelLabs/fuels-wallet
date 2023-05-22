import { cssObj } from '@fuel-ui/css';
import {
  Alert,
  Button,
  Checkbox,
  Dialog,
  Form,
  Icon,
  Stack,
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
          <Stack gap={'$4'}>
            <Text>
              If you lost your password, the only way to recover your wallet is
              to reset the Fuel Wallet extension, select &quot;I already have a
              wallet&quot; and use your secret Seed Phrase.
            </Text>
            <Text>
              Make sure you have backed up your Seed Phrase before proceeding.
            </Text>
            <Alert status="warning" css={styles.alert}>
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
                  stored on this device, including Seed Phrase, accounts,
                  networks and other settings.
                </Form.Label>
              </Form.Control>
            </Alert>
          </Stack>
        </Dialog.Description>
        <Dialog.Footer>
          <Button
            type="submit"
            color="accent"
            isLoading={isLoading}
            leftIcon={Icon.is('LockKeyOpen')}
            isDisabled={!isSavedChecked}
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
  button: cssObj({
    width: '100%',
  }),
  content: cssObj({
    width: WALLET_WIDTH,
    height: WALLET_HEIGHT,
    maxWidth: WALLET_WIDTH,
    maxHeight: 'none',
  }),
  description: cssObj({
    flex: 1,
    flexDirection: 'column',
    display: 'flex',
  }),
  form: cssObj({
    flexDirection: 'row',
  }),
  alert: cssObj({
    py: '0',
    px: '$4',

    '.fuel_alert--icon': {
      display: 'none',
    },
    '.fuel_alert--content': {
      gap: '$4',
    },
    '.fuel_checkbox': {
      width: '$24',
    },
    '.fuel_checkbox:focus-within::after': {
      borderColor: '$yellow5 !important',
    },
  }),
};
