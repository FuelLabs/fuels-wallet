import { cssObj } from '@fuel-ui/css';
import { Button, Alert, Box } from '@fuel-ui/react';

import { useSignUpStepper } from '../../hooks';
import { Header } from '../Header';
import { Stepper } from '../Stepper';

import { Mnemonic } from '~/systems/Core';

export type MnemonicWriteProps = {
  canProceed?: boolean;
  error?: string | boolean;
  onFilled: (words: string[]) => void;
  onNext: () => void;
  onCancel: () => void;
  enableChangeFormat?: boolean;
};

export function MnemonicWrite({
  canProceed,
  error,
  onFilled,
  onCancel,
  onNext,
  enableChangeFormat,
}: MnemonicWriteProps) {
  const { steps, handleChangeStep } = useSignUpStepper();

  function handleFill(val: string[]) {
    onFilled(val);
  }

  return (
    <Box.Stack gap="$6" align="center">
      <Stepper steps={steps} active={3} onChange={handleChangeStep} />
      <Header
        title="Confirm phrase"
        subtitle="Write your phrase again to ensure you wrote it down correctly."
      />
      <Box.Stack gap="$3" css={{ width: '$sm' }}>
        {error && (
          <Alert css={{ py: '$2', px: '$4' }} hideIcon status="error">
            <Alert.Description>{error}</Alert.Description>
          </Alert>
        )}
        <Mnemonic
          type="write"
          onFilled={handleFill}
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
};
