import { cssObj } from '@fuel-ui/css';
import {
  Box,
  Button,
  ButtonLink,
  Card,
  FuelLogo,
  Heading,
  Icon,
  IconButton,
  Text,
} from '@fuel-ui/react';

import type { UnlockFormValues } from '../../hooks';
import { useUnlockForm } from '../../hooks';
import { ResetDialog } from '../ResetDialog';
import { UnlockForm } from '../UnlockForm';

export type UnlockDialogProps = {
  unlockError?: string;
  onUnlock: (value: string) => void;
  onReset?: () => void;
  onClose?: () => void;
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
  onClose,
}: UnlockDialogProps) {
  const form = useUnlockForm({ password: unlockError });
  const { handleSubmit } = form;

  function onSubmit(values: UnlockFormValues) {
    onUnlock(values.password);
  }

  return (
    <Card css={styles.content} as="form" onSubmit={handleSubmit(onSubmit)}>
      <Card.Body css={{ flex: 1 }}>
        {onClose && (
          <IconButton
            variant="link"
            icon={<Icon icon="X" color="intentsBase8" />}
            aria-label="Close unlock card"
            onPress={onClose}
            css={styles.closeButton}
          />
        )}
        <Box css={styles.form}>
          <Box as="div" css={styles.description}>
            <Box.Stack gap="$6" align="center">
              <FuelLogo size={100} css={{ mb: '$4' }} />
              <Box css={{ textAlign: 'center' }}>
                <Heading
                  as="h2"
                  css={{ margin: 0, mb: '$2', textAlign: 'center' }}
                >
                  {headerText}
                </Heading>
                <Text fontSize="sm">Unlock your wallet to continue</Text>
              </Box>
              <UnlockForm form={form} />
            </Box.Stack>
            {onReset && (
              <Box.Stack
                align="center"
                justify="space-between"
                css={{ marginTop: '$2' }}
              >
                <ResetDialog isLoading={isReseting} onReset={onReset}>
                  <ButtonLink
                    variant="ghost"
                    css={{ color: '$intentsBase10', fontSize: 'small' }}
                  >
                    Forgot password?
                  </ButtonLink>
                </ResetDialog>
              </Box.Stack>
            )}
          </Box>
        </Box>
      </Card.Body>
      <Card.Footer>
        <Button
          type="submit"
          intent="primary"
          isLoading={isLoading}
          leftIcon={Icon.is('LockOpen')}
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
    background: '$intentsBase2',
  }),
  button: cssObj({
    width: '100%',
  }),
  content: cssObj({
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    boxSizing: 'border-box',
    borderColor: 'transparent',
    background: '$bodyColor',
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
  closeButton: cssObj({
    position: 'absolute',
    top: '$4',
    right: '$4',
  }),
};
