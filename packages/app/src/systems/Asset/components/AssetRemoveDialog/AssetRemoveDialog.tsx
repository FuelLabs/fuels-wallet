import { AlertDialog, Button } from '@fuel-ui/react';
import type { Asset } from '@fuel-wallet/types';
import type { ReactNode } from 'react';
import { useState } from 'react';

type AssetRemoveDialogProps = {
  children: ReactNode;
  asset: Asset;
  onConfirm: () => void;
};

export function AssetRemoveDialog({
  asset,
  onConfirm,
  children,
}: AssetRemoveDialogProps) {
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
          {asset.name} will be deleted. This action cannot be undone.
        </AlertDialog.Description>
        <AlertDialog.Footer>
          <AlertDialog.Cancel>
            <Button variant="ghost" onPress={handleCancel}>
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
