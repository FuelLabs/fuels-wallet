import { cssObj } from '@fuel-ui/css';
import { AlertDialog, Button } from '@fuel-ui/react';
import type { AssetData } from '@fuel-wallet/types';
import type { ReactNode } from 'react';
import { useState } from 'react';

type AssetRemoveDialogProps = {
  children: ReactNode;
  assetName: string;
  onConfirm: () => void;
};

export function AssetRemoveDialog({
  assetName,
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
      <AlertDialog.Content css={styles.popupContent}>
        <AlertDialog.Heading>Are you sure?</AlertDialog.Heading>
        <AlertDialog.Description>
          {assetName} will be deleted. This action cannot be undone.
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

// TODO: remove this once we fix on the fuel-ui side
const styles = {
  popupContent: cssObj({
    '&.fuel_AlertDialog-content': {
      maxWidth: 250,
    },
  }),
};
