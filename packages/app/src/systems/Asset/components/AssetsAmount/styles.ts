import { cssObj } from '@fuel-ui/css';

export const styles = {
  card: cssObj({
    borderTop: '1px solid $cardBorder',
    px: '$6',
    py: '$2',

    '&[data-error=true]': {
      backgroundColor: '$intentsError3',
    },

    '.fuel_Avatar': {
      width: '$5',
      height: '$5',
    },
  }),
  header: cssObj({
    mb: '$3',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  }),
  root: cssObj({
    gridTemplateColumns: 'repeat(2, 1fr)',
    gridTemplateRows: 'repeat(2, 1fr)',
    fontWeight: '$normal',
    color: '$intentsBase12',

    '& ~ & ': {
      pt: '$2',
      borderTop: '1px solid $border',
    },
  }),
  asset: cssObj({
    alignItems: 'center',
    gap: '$2',

    '& span': {
      fontSize: '$sm',
      color: '$intentsBase12',
    },
  }),
  address: cssObj({
    gridColumn: '1 / 2',
    color: '$intentsBase9',
    fontSize: '$sm',
  }),
  amount: cssObj({
    justifyContent: 'flex-end',
    gridRow: '1 / 3',
    gridColumn: '2 / 3',
    textAlign: 'right',
    fontSize: '$sm',
    color: '$intentsBase12',
    alignItems: 'center',
  }),
  title: cssObj({
    fontSize: '$sm',
    fontWeight: '$normal',
  }),
  assetNft: cssObj({
    fontSize: '$sm',
    lineHeight: 'normal',
  }),
};
