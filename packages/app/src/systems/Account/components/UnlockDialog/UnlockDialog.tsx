import { cssObj } from '@fuel-ui/css';
import { Alert, Button, Dialog, Flex, Icon, Stack } from '@fuel-ui/react';

import type { UnlockFormValues } from '../../hooks';
import { useAccount, useUnlockForm } from '../../hooks';
import { UnlockForm } from '../UnlockForm';

export type UnlockDialogProps = {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export function UnlockDialog({ isOpen, onOpenChange }: UnlockDialogProps) {
  const form = useUnlockForm();
  const { handlers, isLoading } = useAccount();
  const { formState } = form;

  function onSubmit(values: UnlockFormValues) {
    handlers.unlock(values.password);
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Dialog.Content css={styles.content}>
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
          <Dialog.Description>
            <Stack gap="$3">
              <Alert status="info" css={styles.alert}>
                You need to unlock your wallet to be able to make transactions
                and more-sensitive actions.
              </Alert>
              <UnlockForm form={form} />
            </Stack>
          </Dialog.Description>
          <Dialog.Footer>
            <Dialog.Close>
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
            </Dialog.Close>
          </Dialog.Footer>
        </Dialog.Content>
      </form>
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
    maxWidth: 312,

    /** This is temporary until have this option on @fuel-ui */
    'button[aria-label="Close"]': {
      display: 'none',
    },
  }),
};
