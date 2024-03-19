import { cssObj } from '@fuel-ui/css';
import { Alert, Box, Button } from '@fuel-ui/react';
import { Mnemonic, MotionStack, animations } from '~/systems/Core';

import { useSignUpStepper } from '../../hooks';
import { Header } from '../Header';
import { Stepper } from '../Stepper';

export type MnemonicWriteProps = {
  title: string;
  subtitle: string;
  canProceed?: boolean;
  step: number;
  error?: string | boolean;
  onFilled: (words: string[]) => void;
  onChange?: (words: string[]) => void;
  onNext: () => void;
  onCancel: () => void;
  enableChangeFormat?: boolean;
};

export function MnemonicWrite({
  title,
  subtitle,
  canProceed,
  error,
  step,
  onFilled,
  onChange,
  onCancel,
  onNext,
  enableChangeFormat,
}: MnemonicWriteProps) {
  const { steps } = useSignUpStepper();

  function handleFill(val: string[]) {
    onFilled(val);
  }

  return (
    <Box.Stack gap="$6" align="center">
      <Stepper steps={steps} active={step} />
      <Header title={title} subtitle={subtitle} />
      <MotionStack {...animations.slideInRight()} gap="$6" align="center">
        <Box.Stack gap="$3" css={styles.content}>
          {error && (
            <Alert status="error">
              <Alert.Description>{error}</Alert.Description>
            </Alert>
          )}
          <Mnemonic
            type="write"
            onFilled={handleFill}
            onChange={onChange}
            enableChangeFormat={enableChangeFormat}
          />
        </Box.Stack>
        <Box.Flex css={styles.footer}>
          <Button variant="ghost" onPress={onCancel}>
            Back
          </Button>
          <Button intent="primary" onPress={onNext} isDisabled={!canProceed}>
            Next: Your password
          </Button>
        </Box.Flex>
      </MotionStack>
    </Box.Stack>
  );
}

const styles = {
  footer: cssObj({
    width: '$full',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gridGap: '$4',
  }),
  content: cssObj({
    width: '$sm',
  }),
};
