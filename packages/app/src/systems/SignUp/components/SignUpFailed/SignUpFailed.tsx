import { Stack, Button, Flex, Alert } from '@fuel-ui/react';

import { Header } from '../Header';

import { ImageLoader, relativeUrl } from '~/systems/Core';

export type SignUpFailedProps = {
  error?: string;
};

export function SignUpFailed({ error }: SignUpFailedProps) {
  return (
    <Stack gap="$6">
      <Flex justify="center">
        <ImageLoader
          src={relativeUrl('/signup-illustration-4.svg')}
          width={129}
          height={116}
        />
      </Flex>
      <Header
        title="Oops, something failed!"
        subtitle="Try to input other values"
      />
      <Alert status="error">
        <Alert.Description>{error?.toString()}</Alert.Description>
      </Alert>
      <Button color="accent">Back</Button>
    </Stack>
  );
}
