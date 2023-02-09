import { Button, Card, Dialog, Icon, IconButton, Text } from '@fuel-ui/react';

import { useAccounts } from '../../hooks';

import { useOverlay } from '~/systems/Overlay';

export const Logout = () => {
  const { isLoading, handlers } = useAccounts();
  const overlay = useOverlay();

  return (
    <>
      <Dialog.Heading>
        Logout
        <IconButton
          data-action="closed"
          variant="link"
          icon={<Icon icon="X" color="gray8" />}
          aria-label="Close unlock window"
          onPress={overlay.close}
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
            Make sure you have securely backed up your seed phrase before
            removing the wallet.
          </Text>
          <Text color="gray11" css={{ mb: '$2' }}>
            If you have not backed up your seed phrase, you will lose access to
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
