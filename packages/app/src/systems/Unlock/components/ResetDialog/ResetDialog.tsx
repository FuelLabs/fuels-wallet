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
              to delete all data and set up your wallet with your seed phrase.
              Make sure you have backed up your seed phrase before proceeding.
            </Text>
            <Alert status="warning">
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
                  I understand by resetting my wallet I&apos;ll remove all data
                  stored on this device, including seed phrase, accounts,
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
  headingIcon: cssObj({
    marginRight: '$3',
  }),
  alert: cssObj({
    py: '$2',
    pr: '$2',
    background: '$gray2',
  }),
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
  form: cssObj({
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  }),
};
