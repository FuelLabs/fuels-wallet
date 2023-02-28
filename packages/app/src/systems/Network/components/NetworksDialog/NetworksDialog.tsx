import { cssObj } from '@fuel-ui/css';
import { Dialog } from '@fuel-ui/react';

import { AddNetwork, Networks, UpdateNetwork } from '../../pages';

import { WALLET_HEIGHT, WALLET_WIDTH } from '~/config';
import { useOverlay } from '~/systems/Overlay';

export function NetworksDialog() {
  const overlay = useOverlay();

  return (
    <Dialog isOpen={overlay.is((val) => val.includes('networks'))}>
      <Dialog.Content css={styles.content}>
        {overlay.is('networks.list') && <Networks />}
        {overlay.is('networks.add') && <AddNetwork />}
        {overlay.is('networks.update') && <UpdateNetwork />}
      </Dialog.Content>
    </Dialog>
  );
}

const styles = {
  content: cssObj({
    width: WALLET_WIDTH,
    height: WALLET_HEIGHT,
    maxWidth: WALLET_WIDTH,
    maxHeight: 'none',

    '.fuel_dialog--heading, .fuel_dialog--footer': {
      borderColor: '$gray2',
    },
    '.fuel_dialog--description': {
      flex: 1,
      overflowY: 'auto',
      height: '100%',
    },
    '.fuel_dialog--heading': cssObj({
      display: 'flex',
      justifyContent: 'space-between',
    }),
    '.fuel_dialog--footer': cssObj({
      button: {
        width: '100%',
      },
    }),
    form: cssObj({
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
    }),
    'button[data-action="closed"]': {
      px: '$1',
    },
  }),
};
