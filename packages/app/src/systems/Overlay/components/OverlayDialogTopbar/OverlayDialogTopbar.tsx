import { cssObj } from '@fuel-ui/css';
import { Box, Dialog, Icon, IconButton } from '@fuel-ui/react';
import type { ReactNode } from 'react';

export type OverlayDialogTopbarProps = {
  children: ReactNode;
  onClose?: () => void;
  onBack?: () => void;
};

export function OverlayDialogTopbar({
  children,
  onClose,
  onBack,
}: OverlayDialogTopbarProps) {
  function handleBack() {
    onBack?.();
    onClose?.();
  }

  return (
    <Dialog.Heading css={styles.root}>
      {onBack && (
        <IconButton
          data-action="back"
          variant="link"
          icon={<Icon icon="ChevronLeft" />}
          aria-label="Back"
          onPress={handleBack}
        />
      )}
      <Box.Flex align="center">{children}</Box.Flex>
      {onClose && (
        <IconButton
          data-action="closed"
          variant="link"
          icon={<Icon icon="X" />}
          aria-label="Close unlock window"
          onPress={onClose}
          css={styles.close}
        />
      )}
    </Dialog.Heading>
  );
}

const styles = {
  root: cssObj({
    display: 'flex',
    justifyContent: 'flex-start !important',
    gap: '$2',

    '.fuel_Box-flex': {
      flex: 1,
    },
  }),
  close: cssObj({
    position: 'relative !important',
    top: '0 !important',
    left: '0 !important',
  }),
};
