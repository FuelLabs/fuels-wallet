import { cssObj } from '@fuel-ui/css';
import { Button, Alert, Box } from '@fuel-ui/react';

import { Header } from '../Header';

import { ImageLoader, relativeUrl, Mnemonic } from '~/systems/Core';

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
  function handleFill(val: string[]) {
    onFilled(val);
  }

  return (
    <Box.Stack gap="$6" align="center">
      <ImageLoader
        src={relativeUrl('/signup-illustration-1.svg')}
        width={129}
        height={116}
      />
      <Header
        title="Enter seed phrase"
        subtitle="Paste bellow the words you copied before"
      />
      <Box.Stack gap="$3" css={{ width: 450 }}>
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
          Go to Password
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
