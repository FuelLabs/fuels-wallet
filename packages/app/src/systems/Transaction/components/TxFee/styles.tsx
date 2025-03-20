import { cssObj } from '@fuel-ui/css';

export const styles = {
  detailItem: (_active = false, hasCheckbox = false, title = false) =>
    cssObj({
      padding: hasCheckbox ? '$3 $4' : '$3',
      flexDirection: title ? 'row' : 'column',
      alignItems: 'flex-start',
      boxSizing: 'border-box',
      width: '100%',
      display: 'flex',
      columnGap: title ? '$4' : '$6',
      gap: title ? undefined : '$1',
      position: 'relative',
      cursor: hasCheckbox ? 'pointer' : 'auto',
      backgroundColor: '$cardBg',
      borderRadius: '8px',
      border: '1px solid $inputBaseBorder',
      '&:hover': {
        borderColor: '$inputActiveBorder',
      },
      '&:focus-visible': {
        borderColor: '$intentsBase5',
        outline: 'none',
      },
    }),
  title: cssObj({
    fontSize: '$sm',
    fontWeight: '$medium',
    textWrap: 'nowrap',
  }),
  amount: cssObj({
    fontSize: '$sm',
    fontWeight: '$medium',
    wordWrap: 'break-word',
    minWidth: 0,
  }),
  usd: cssObj({
    fontSize: '$sm',
    fontWeight: '$semibold',
    wordWrap: 'break-word',
    color: '$textHeading',
    ml: '$3',
  }),
  option: cssObj({
    alignItems: 'center',
    backgroundColor: '$cardBg',
    border: '1px solid $gray5',
    borderRadius: '10px',
    color: '$gray1',
    cursor: 'pointer',
    fontSize: '13px',
    gap: '$3',
    justifyContent: 'space-between',
    padding: '$3',
    transition: 'all 0.2s ease',

    '&:hover': {
      backgroundColor: '$gray3',
    },
  }),
  optionContent: cssObj({
    color: '$gray12',
  }),
  optionLabel: cssObj({
    color: '$gray12',
    fontSize: '$sm !important',
    fontWeight: '$semibold',
    ml: '4px',
  }),
};
