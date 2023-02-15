import { cssObj } from '@fuel-ui/css';
import { Button, Dialog, Icon, Stack, Text } from '@fuel-ui/react';

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
  return (
    <Dialog>
      <Dialog.Trigger>{children}</Dialog.Trigger>
      <Dialog.Content css={styles.content}>
        <Dialog.Close />
        <Dialog.Heading>Forgot password</Dialog.Heading>
        <Dialog.Description as="div" css={styles.description}>
          <Stack gap={'$2'}>
            <Text>
              If you have lost your password, the only way to recover your
              wallet it is by using your seed phrase.{' '}
            </Text>
            <Text css={styles.warning}>
              This action will remove all data stored on this device, including
              your seed phrase, accounts, networks and other settings.
            </Text>
            <Text>
              Make sure you have backed up your seed phrase before proceeding.
            </Text>
          </Stack>
        </Dialog.Description>
        <Dialog.Footer>
          <Button
            type="submit"
            color="accent"
            isLoading={isLoading}
            leftIcon={Icon.is('LockKeyOpen')}
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
    color: '$gray11',
    fontWeight: '$extrabold',
  }),
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
  }),
  form: cssObj({
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  }),
};
