import { cssObj } from '@fuel-ui/css';
import { AlertDialog, Box, Button, Text } from '@fuel-ui/react';
import type { Connection } from '@fuel-wallet/types';
import type { ReactNode } from 'react';
import { useState } from 'react';

type ConnectionRemoveDialogProps = {
  children: ReactNode;
  connection: Connection;
  onConfirm: () => void;
  isConfirming: boolean;
};

export function ConnectionRemoveDialog({
  connection,
  onConfirm,
  children,
  isConfirming,
}: ConnectionRemoveDialogProps) {
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
        {/* TODO: Fix on fuel-ui AlertDialog.Description for the as prop to work correctly */}
        <Box.Stack className="fuel_AlertDialog-description">
          <Text className="from">{connection.origin}</Text>
          <Text className="message">
            You will lose the connection of all your accounts with this website.
            Are you sure you want to disconnect?
          </Text>
        </Box.Stack>
        <AlertDialog.Footer>
          <AlertDialog.Cancel>
            <Button variant="outlined" onPress={handleCancel}>
              Cancel
            </Button>
          </AlertDialog.Cancel>
          <AlertDialog.Action>
            <Button
              aria-label="Confirm delete"
              variant="ghost"
              intent="error"
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

    '.fuel_AlertDialogDescription': {
      '.from, .message': {
        textSize: 'sm',
      },
      '.from': {
        mb: '$1',
        color: '$intentsBase12',
        fontWeight: '$normal',
      },
    },
  }),
};
