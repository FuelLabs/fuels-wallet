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

import type { UnlockFormValues } from '../../hooks/useUnlockForm';
import { useUnlockForm } from '../../hooks/useUnlockForm';
import { UnlockForm } from '../UnlockForm';

import { IS_CRX_POPUP } from '~/config';
import { Services, store } from '~/store';
import { useUnlock } from '~/systems/Account/hooks/useUnlock';

export type UnlockDialogProps = {
  isFullscreen?: boolean;
};

export function UnlockDialog({
  isFullscreen = IS_CRX_POPUP,
}: UnlockDialogProps) {
  const unlock = useUnlock();
  const { unlockError, isUnlocking, isUnlockingLoading } = unlock;
  const isLoading = isUnlockingLoading;

  const form = useUnlockForm({ password: unlockError });
  const { handleSubmit } = form;

  function onSubmit({ password }: UnlockFormValues) {
    store.send(Services.unlock, { type: 'UNLOCK', input: { password } });
  }

  return (
    <Dialog isOpen={isUnlocking}>
      <Dialog.Content css={styles.content} data-fullscreen={isFullscreen}>
        <Dialog.Heading>
          <Flex css={{ alignItems: 'center' }}>
            <Flex css={{ flex: 1 }}>
              <Icon
                color="gray8"
                icon={Icon.is('LockKeyOpen')}
                css={styles.headingIcon}
              />
              Unlocking Wallet
            </Flex>
            <IconButton
              variant="link"
              icon={<Icon icon="X" color="gray8" />}
              aria-label="Close unlock window"
              onPress={store.closeUnlock}
            />
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
  content: cssObj({
    /** This is temporary until have this option on @fuel-ui */
    'button[aria-label="Close"]': {
      display: 'none',
    },

    '&[data-fullscreen="true"]': {
      borderRadius: '$none',
      width: '100vw',
      maxWidth: '100vw',
      height: '100vh',
      maxHeight: '100vh',
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
