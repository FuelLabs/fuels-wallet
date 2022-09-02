import { Stack, Image, Button, Flex, Alert } from "@fuel-ui/react";

import { Header } from "../Header";

export type SignUpFailedProps = {
  error?: string;
};

export function SignUpFailed({ error }: SignUpFailedProps) {
  return (
    <Stack gap="$6">
      <Flex justify="center">
        <Image src="/signup-illustration-4.svg" />
      </Flex>
      <Header
        title="Oops, something failed!"
        subtitle="Try to input other values"
      />
      <Alert status="error">
        <Alert.Description>{error?.toString()}</Alert.Description>
      </Alert>
      <Button size="sm" color="accent">
        Back
      </Button>
    </Stack>
  );
}
