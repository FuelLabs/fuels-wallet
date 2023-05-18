import { Button, Card, Dialog, Icon, IconButton, Text } from '@fuel-ui/react';

import { useAccounts } from '../../hooks';

export const Logout = () => {
  const { isLoading, handlers } = useAccounts();

  return (
    <>
      <Dialog.Heading>
        Logout
        <IconButton
          data-action="closed"
          variant="link"
          icon={<Icon icon="X" color="gray8" />}
          aria-label="Close unlock window"
          onPress={handlers.closeDialog}
        />
      </Dialog.Heading>
      <Dialog.Description as="div">
        <Card css={{ padding: '$4' }}>
          <Text
            as="h2"
            color="gray12"
            leftIcon={<Icon icon={Icon.is('Warning')} color="yellow12" />}
            css={{ mb: '$4' }}
          >
            IMPORTANT
          </Text>
          <Text color="gray11" css={{ mb: '$2' }}>
            This action will remove all data from this device, including your
            seedphrase and accounts.
          </Text>
          <Text color="gray11" css={{ mb: '$2' }}>
            Make sure you have securely backed up your Seed Phrase before
            removing the wallet.
          </Text>
          <Text color="gray11" css={{ mb: '$2' }}>
            If you have not backed up your Seed Phrase, you will lose access to
            your funds.
          </Text>
          <Text color="gray11" css={{ mb: '$2' }}></Text>
        </Card>
      </Dialog.Description>
      <Dialog.Footer>
        <Button
          aria-label="Logout"
          onPress={handlers.logout}
          isLoading={isLoading}
          isDisabled={isLoading}
          variant="ghost"
          color="red"
        >
          Logout
        </Button>
      </Dialog.Footer>
    </>
  );
};
