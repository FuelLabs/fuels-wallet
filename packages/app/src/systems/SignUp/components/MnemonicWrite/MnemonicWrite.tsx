import { Stack, Flex, Button, Alert } from '@fuel-ui/react';
import { useState } from 'react';

import { Header } from '../Header';

import { ImageLoader, Mnemonic, relativeUrl } from '~/systems/Core';

export type MnemonicWriteProps = {
  canProceed?: boolean;
  error?: string | boolean;
  onFilled: (words: string[]) => void;
  onNext: () => void;
  onCancel: () => void;
};

export function MnemonicWrite({
  canProceed,
  error,
  onFilled,
  onCancel,
  onNext,
}: MnemonicWriteProps) {
  const [isFilled, setFilled] = useState(false);

  function handleFill(val: string[]) {
    setFilled(true);
    onFilled(val);
  }

  return (
    <Stack gap="$6" align="center">
      <ImageLoader
        src={relativeUrl('/signup-illustration-1.svg')}
        width={129}
        height={116}
      />
      <Header
        title="Write down your Recover Phrase "
        subtitle="You will need it on the next step"
      />
      <Stack gap="$3" css={{ width: 400 }}>
        {error && (
          <Alert css={{ fontSize: '$sm', py: '$2' }} status="error">
            <Alert.Description>{error}</Alert.Description>
          </Alert>
        )}
        <Mnemonic type="write" onFilled={handleFill} />
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
          isDisabled={!isFilled || !canProceed}
        >
          Next
        </Button>
      </Flex>
    </Stack>
  );
}
