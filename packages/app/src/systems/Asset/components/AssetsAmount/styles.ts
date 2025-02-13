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
    minWidth: 0,

    '& ~ & ': {
      pt: '$2',
      borderTop: '1px solid $border',
    },
  }),
  asset: cssObj({
    gridArea: '1 / 1 / 2 / 2',
    alignItems: 'center',
    gap: '$2',

    '& span': {
      fontSize: '$sm',
    },
  }),
  address: cssObj({
    gridArea: '2 / 1 / 3 / 2',
    color: '$intentsBase9',
    fontSize: '$sm',
  }),
  amountContainer: cssObj({
    columnGap: '$1',
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexWrap: 'nowrap',
    gridArea: '1 / 2 / 2 / 3',
    minWidth: '0',
    textAlign: 'right',
    fontSize: '$sm',
  }),
  amountValue: cssObj({
    display: 'inline-block',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    fontWeight: '$medium',
    color: '$textHeading',
  }),
  amountInUsd: cssObj({
    gridArea: '2 / 2 / 3 / 3',
    fontSize: '$sm',
    color: '$textSubtext',
    display: 'inline-block',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    textAlign: 'right',
  }),
  amountSymbol: cssObj({
    flexShrink: 0,
    fontWeight: '$medium',
    color: '$textHeading',
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
