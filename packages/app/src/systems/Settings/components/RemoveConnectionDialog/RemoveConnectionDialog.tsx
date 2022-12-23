import { cssObj } from '@fuel-ui/css';
import { AlertDialog, Button, Text } from '@fuel-ui/react';
import type { Connection } from '@fuel-wallet/types';
import type { ReactNode } from 'react';
import { useState } from 'react';

type RemoveConnectionDialogProps = {
  children: ReactNode;
  connection: Connection;
  onConfirm: () => void;
  isConfirming: boolean;
};

export function RemoveConnectionDialog({
  connection,
  onConfirm,
  children,
  isConfirming,
}: RemoveConnectionDialogProps) {
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
      <AlertDialog.Content css={styles.root}>
        <AlertDialog.Heading>Disconnecting App</AlertDialog.Heading>
        <AlertDialog.Description as="div">
          <Text className="from">{connection.origin}</Text>
          <Text className="message">
            You will lose the connection of all your accounts with this website.
            Are you sure you want to disconnect?
          </Text>
        </AlertDialog.Description>
        <AlertDialog.Footer>
          <AlertDialog.Cancel>
            <Button
              size="sm"
              color="gray"
              variant="ghost"
              onPress={handleCancel}
            >
              Cancel
            </Button>
          </AlertDialog.Cancel>
          <AlertDialog.Action>
            <Button
              size="sm"
              aria-label="Confirm delete"
              variant="outlined"
              color="tomato"
              onPress={handleConfirm}
              isLoading={isConfirming}
            >
              Confirm
            </Button>
          </AlertDialog.Action>
        </AlertDialog.Footer>
      </AlertDialog.Content>
    </AlertDialog>
  );
}

const styles = {
  root: cssObj({
    textAlign: 'center',

    footer: {
      justifyContent: 'center',
    },

    '.fuel_alert-dialog--description': {
      '.from, .message': {
        textSize: 'sm',
      },
      '.from': {
        mb: '$1',
        color: '$gray12',
        fontWeight: '$bold',
      },
    },
  }),
};
