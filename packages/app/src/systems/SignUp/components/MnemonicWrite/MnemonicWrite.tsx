import { Stack, Flex, Button, Alert } from '@fuel-ui/react';

import { Header } from '../Header';

import { ImageLoader, Mnemonic, relativeUrl } from '~/systems/Core';

export type MnemonicWriteProps = {
  canProceed?: boolean;
  error?: string | boolean;
  onFilled: (words: string[]) => void;
  onNext: () => void;
  onCancel: () => void;
  isLoading?: boolean;
  enableChangeFormat?: boolean;
};

export function MnemonicWrite({
  canProceed,
  error,
  onFilled,
  onCancel,
  onNext,
  isLoading,
  enableChangeFormat,
}: MnemonicWriteProps) {
  function handleFill(val: string[]) {
    onFilled(val);
  }

  return (
    <Stack gap="$6" align="center">
      <ImageLoader
        src={relativeUrl('/signup-illustration-1.svg')}
        width={129}
        height={116}
      />
      <Header title="Enter your Recovery Phrase" />
      <Stack gap="$3" css={{ width: 400 }}>
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
      </Stack>
      <Flex gap="$4">
        <Button
          color="gray"
          variant="ghost"
          css={{ width: 130 }}
          onPress={onCancel}
        >
          Cancel
        </Button>
        <Button
          color="accent"
          css={{ width: 130 }}
          onPress={onNext}
          isDisabled={!canProceed}
          isLoading={isLoading}
        >
          Next
        </Button>
      </Flex>
    </Stack>
  );
}
