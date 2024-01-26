import { AlertDialog, Button } from '@fuel-ui/react';
import type { NetworkData } from '@fuel-wallet/types';
import type { ReactNode } from 'react';
import { useState } from 'react';

type NetworkRemoveDialogProps = {
  children: ReactNode;
  network: NetworkData;
  onConfirm: () => void;
};

export function NetworkRemoveDialog({
  network,
  onConfirm,
  children,
}: NetworkRemoveDialogProps) {
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
        <AlertDialog.Heading>Are you sure?</AlertDialog.Heading>
        <AlertDialog.Description>
          This action cannot be undone. {network.name} will be permanently
          deleted.
        </AlertDialog.Description>
        <AlertDialog.Footer>
          <AlertDialog.Cancel>
            <Button variant="outlined" onPress={handleCancel}>
              Cancel
            </Button>
          </AlertDialog.Cancel>
          <AlertDialog.Action>
            <Button variant="ghost" intent="error" onPress={handleConfirm}>
              Confirm
            </Button>
          </AlertDialog.Action>
        </AlertDialog.Footer>
      </AlertDialog.Content>
    </AlertDialog>
  );
}
