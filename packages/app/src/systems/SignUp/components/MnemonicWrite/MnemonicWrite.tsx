import { Stack, Flex, Button, Alert } from '@fuel-ui/react';

import { Header } from '../Header';

import { ImageLoader, relativeUrl } from '~/systems/Core';
import { MnemonicConfirm } from '~/systems/SignUp/components/MnemonicConfirm';

export type MnemonicWriteProps = {
  canProceed?: boolean;
  error?: string | boolean;
  onFilled: (words: string[]) => void;
  onNext: () => void;
  onCancel: () => void;
  isLoading?: boolean;
  enableChangeFormat?: boolean;
  words?: string[];
  positions?: number[];
  defaultValue?: string[];
};

export function MnemonicWrite({
  canProceed,
  error,
  onFilled,
  onCancel,
  onNext,
  isLoading,
  words,
  positions,
  defaultValue,
}: MnemonicWriteProps) {
  return (
    <Stack gap="$6" align="center">
      <ImageLoader
        src={relativeUrl('/signup-illustration-1.svg')}
        width={129}
        height={116}
      />
      <Header
        title="Confirm your Recovery Phrase"
        subtitle="Enter the correct word for each position"
      />
      <Stack gap="$3" css={{ width: 400 }}>
        {error && (
          <Alert css={{ fontSize: '$sm', py: '$2' }} status="error">
            <Alert.Description>{error}</Alert.Description>
          </Alert>
        )}
        <MnemonicConfirm
          readOnly={!!defaultValue}
          defaultValue={defaultValue}
          onFilled={onFilled}
          words={words}
          positions={positions}
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
          isLoading={isLoading}
          isDisabled={!canProceed}
        >
          Next
        </Button>
      </Flex>
    </Stack>
  );
}
