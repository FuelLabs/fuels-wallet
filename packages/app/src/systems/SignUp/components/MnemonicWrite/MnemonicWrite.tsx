import { Button, Alert, Box } from '@fuel-ui/react';

import { Header } from '../Header';

import { ImageLoader, Mnemonic, relativeUrl } from '~/systems/Core';

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
      <Header title="Enter your Recovery Phrase" />
      <Box.Stack gap="$3" css={{ width: 400 }}>
        {error && (
          <Alert css={{ fontSize: '$sm', py: '$2' }} status="error">
            <Alert.Description>{error}</Alert.Description>
          </Alert>
        )}
        <Mnemonic
          type="write"
          onFilled={handleFill}
          enableChangeFormat={enableChangeFormat}
        />
      </Box.Stack>
      <Box.Flex gap="$4">
        <Button variant="ghost" css={{ width: 130 }} onPress={onCancel}>
          Cancel
        </Button>
        <Button
          intent="primary"
          css={{ width: 130 }}
          onPress={onNext}
          isDisabled={!canProceed}
        >
          Next
        </Button>
      </Box.Flex>
    </Box.Stack>
  );
}
