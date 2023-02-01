import { cssObj } from '@fuel-ui/css';
import {
  Alert,
  Box,
  Button,
  Dialog,
  Flex,
  Icon,
  IconButton,
  Stack,
} from '@fuel-ui/react';

import { useUnlockForm } from '../../hooks';
import type { UnlockFormValues } from '../../hooks';
import { UnlockForm } from '../UnlockForm';

export type UnlockDialogProps = {
  title?: string;
  unlockText?: string;
  unlockError?: string;
  isOpen?: boolean;
  onClose?: () => void;
  onUnlock: (value: string) => void;
  isLoading?: boolean;
};

export function UnlockContent({
  title,
  unlockText,
  unlockError,
  onClose,
  onUnlock,
  isLoading,
}: UnlockDialogProps) {
  const form = useUnlockForm({ password: unlockError });
  const { handleSubmit } = form;

  function onSubmit(values: UnlockFormValues) {
    onUnlock(values.password);
  }
  return (
    <>
      <Dialog.Heading css={styles.heading}>
        <Flex css={{ flex: 1 }}>
          <Icon
            color="gray8"
            icon={Icon.is('LockKeyOpen')}
            css={styles.headingIcon}
          />
          {title ?? 'Unlock Wallet'}
        </Flex>
        {onClose && (
          <IconButton
            data-action="closed"
            variant="link"
            icon={<Icon icon="X" color="gray8" />}
            aria-label="Close unlock window"
            onPress={onClose}
          />
        )}
      </Dialog.Heading>
      <Box as="form" onSubmit={handleSubmit(onSubmit)} css={styles.form}>
        <Dialog.Description as="div" css={styles.description}>
          <Stack gap="$3">
            <Alert status="info" css={styles.alert}>
              You need to unlock your wallet to be able to make transactions and
              more-sensitive actions.
            </Alert>
            <UnlockForm form={form} />
          </Stack>
        </Dialog.Description>
        <Dialog.Footer>
          <Button
            type="submit"
            color="accent"
            isLoading={isLoading}
            leftIcon={Icon.is('LockKeyOpen')}
            css={styles.button}
            aria-label="Unlock wallet"
          >
            {unlockText ?? 'Unlock'}
          </Button>
        </Dialog.Footer>
      </Box>
    </>
  );
}

export function UnlockDialog(props: UnlockDialogProps) {
  const { isOpen } = props;
  return (
    <Dialog isOpen={isOpen}>
      <Dialog.Content css={styles.content}>
        <UnlockContent {...props} />
      </Dialog.Content>
    </Dialog>
  );
}

const styles = {
  heading: cssObj({
    'button[data-action="closed"]': {
      px: '$1',
    },
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
    width: '330px',
    height: '580px',
    maxWidth: '330px',
    maxHeight: 'none',
  }),
  description: cssObj({
    flex: 1,
  }),
  form: cssObj({
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  }),
};
