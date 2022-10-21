import { AlertDialog, Button } from '@fuel-ui/react';
import type { Network } from '@fuels-wallet/types';
import type { ReactNode } from 'react';
import { useState } from 'react';

type RemoveNetworkDialogProps = {
  children: ReactNode;
  network: Network;
  onConfirm: () => void;
};

export function RemoveNetworkDialog({
  network,
  onConfirm,
  children,
}: RemoveNetworkDialogProps) {
  const [opened, setOpened] = useState(false);

  function handleCancel() {
    setOpened(false);
  }

  function handleConfirm() {
    onConfirm();
    setOpened(false);
  }

  return (
    <AlertDialog open={opened} onOpenChange={setOpened}>
      <AlertDialog.Trigger>{children}</AlertDialog.Trigger>
      <AlertDialog.Content>
        <AlertDialog.Heading>Are you absolutely sure?</AlertDialog.Heading>
        <AlertDialog.Description>
          This action cannot be undone. {network.name} will be permanently
          deleted.
        </AlertDialog.Description>
        <AlertDialog.Footer>
          <AlertDialog.Cancel>
            <Button color="gray" variant="ghost" onPress={handleCancel}>
              Cancel
            </Button>
          </AlertDialog.Cancel>
          <AlertDialog.Action>
            <Button variant="outlined" color="tomato" onPress={handleConfirm}>
              Confirm
            </Button>
          </AlertDialog.Action>
        </AlertDialog.Footer>
      </AlertDialog.Content>
    </AlertDialog>
  );
}
