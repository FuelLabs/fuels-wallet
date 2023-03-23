import { cssObj } from '@fuel-ui/css';
import {
  Box,
  Button,
  ButtonLink,
  Card,
  FuelLogo,
  Heading,
  Icon,
  Stack,
  Text,
} from '@fuel-ui/react';

import type { UnlockFormValues } from '../../hooks';
import { useUnlockForm } from '../../hooks';
import { ResetDialog } from '../ResetDialog';
import { UnlockForm } from '../UnlockForm';

import { WALLET_HEIGHT, WALLET_WIDTH } from '~/config';

export type UnlockDialogProps = {
  unlockError?: string;
  onUnlock: (value: string) => void;
  onReset?: () => void;
  isReseting?: boolean;
  isLoading?: boolean;
  headerText?: string;
};

export function UnlockCard({
  unlockError,
  onUnlock,
  onReset,
  isReseting,
  isLoading,
  headerText = 'Welcome back',
}: UnlockDialogProps) {
  const form = useUnlockForm({ password: unlockError });
  const { handleSubmit } = form;

  function onSubmit(values: UnlockFormValues) {
    onUnlock(values.password);
  }

  return (
    <Card css={styles.content} as="form" onSubmit={handleSubmit(onSubmit)}>
      <Card.Body css={{ flex: 1 }}>
        <Box css={styles.form}>
          <Box as="div" css={styles.description}>
            <Stack gap="$2">
              <Stack align="center">
                <FuelLogo size={150} />
                <Heading as="h2" css={{ margin: 0, textAlign: 'center' }}>
                  {headerText}
                </Heading>
                <Text fontSize="sm">Unlock your wallet to continue</Text>
              </Stack>
              <Box css={{ marginTop: '$4' }}>
                <UnlockForm form={form} />
              </Box>
            </Stack>
            {onReset && (
              <Stack
                align="center"
                justify="space-between"
                css={{ marginTop: '$2' }}
              >
                <ResetDialog isLoading={isReseting} onReset={onReset}>
                  <ButtonLink
                    variant="ghost"
                    css={{ color: '$gray10', fontSize: 'small' }}
                  >
                    Forgot password?
                  </ButtonLink>
                </ResetDialog>
              </Stack>
            )}
          </Box>
        </Box>
      </Card.Body>
      <Card.Footer>
        <Button
          type="submit"
          color="accent"
          isLoading={isLoading}
          leftIcon={Icon.is('LockKeyOpen')}
          css={styles.button}
          aria-label="Unlock wallet"
        >
          Unlock
        </Button>
      </Card.Footer>
    </Card>
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
    marginTop: '$8',
  }),
  form: cssObj({
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  }),
};
