import { cssObj } from '@fuel-ui/css';
import { WALLET_WIDTH, WALLET_HEIGHT } from '~/config';

export const scrollable = (
  regularColor: string = '$intentsBase1',
  hoverColor: string = '$intentsBase10',
) =>
  cssObj({
    overflowY: 'overlay',
    overflowX: 'hidden',
    scrollBehavior: 'smooth',

    '&::-webkit-scrollbar': {
      width: '$4',
      backgroundColor: 'transparent',
    },
    '&::-webkit-scrollbar-track': {
      backgroundColor: 'transparent',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: regularColor,
      opacity: 0.5,
      border: '4px solid transparent',
      borderRadius: '12px',
      backgroundClip: 'content-box',
    },
    '&::-webkit-scrollbar-thumb:hover': {
      backgroundColor: hoverColor,
    },
  });

export const fullscreen = cssObj({
  display: 'flex',
  flexDirection: 'column',
  width: WALLET_WIDTH,
  minWidth: WALLET_WIDTH,
  maxWidth: WALLET_WIDTH,
  height: WALLET_HEIGHT,
  minHeight: WALLET_HEIGHT,
  maxHeight: WALLET_HEIGHT,
});

export const coreStyles = {
  fullscreen,
  scrollable,
};
