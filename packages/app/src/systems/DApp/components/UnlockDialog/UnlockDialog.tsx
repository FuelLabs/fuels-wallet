import { cssObj } from '@fuel-ui/css';
import { Alert, Box, Button, Dialog, Flex, Icon, Stack } from '@fuel-ui/react';

import type { UnlockFormValues } from '../../hooks';
import { useUnlockForm } from '../../hooks';
import { UnlockForm } from '../UnlockForm';

export type UnlockDialogProps = {
  isOpen?: boolean;
  onClose?: () => void;
  onUnlock: (value: string) => void;
  isLoading?: boolean;
  isFullscreen?: boolean;
};

export function UnlockDialog({
  isOpen,
  onClose,
  onUnlock,
  isLoading,
  isFullscreen,
}: UnlockDialogProps) {
  const form = useUnlockForm();
  const { formState, handleSubmit } = form;

  function onSubmit(values: UnlockFormValues) {
    onUnlock(values.password);
  }

  return (
    <Dialog open={isOpen}>
      <Dialog.Content
        css={styles.content(isFullscreen)}
        onEscapeKeyDown={onClose}
        onPointerDownOutside={onClose}
      >
        <Dialog.Heading>
          <Flex css={{ alignItems: 'center' }}>
            <Icon
              color="gray8"
              icon={Icon.is('LockKeyOpen')}
              css={styles.headingIcon}
            />
            Unlock Wallet
          </Flex>
        </Dialog.Heading>
        <Box as="form" onSubmit={handleSubmit(onSubmit)} css={styles.form}>
          <Dialog.Description as="div" css={styles.description}>
            <Stack gap="$3">
              <Alert status="info" css={styles.alert}>
                You need to unlock your wallet to be able to make transactions
                and more-sensitive actions.
              </Alert>
              <UnlockForm form={form} />
            </Stack>
          </Dialog.Description>
          <Dialog.Footer>
            <Button
              type="submit"
              color="accent"
              isDisabled={!formState.isValid}
              isLoading={isLoading}
              leftIcon={Icon.is('LockKeyOpen')}
              css={styles.button}
            >
              Unlock
            </Button>
          </Dialog.Footer>
        </Box>
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
  content: (isFullscreen?: boolean) =>
    cssObj({
      ...(isFullscreen && {
        borderRadius: '$none',
        width: '100vw',
        maxWidth: '100vw',
        height: '100vh',
        maxHeight: '100vh',
      }),

      /** This is temporary until have this option on @fuel-ui */
      'button[aria-label="Close"]': {
        display: 'none',
      },
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
