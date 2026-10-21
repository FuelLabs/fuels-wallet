import { cssObj } from '@fuel-wallet/ui';

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
      border: '1px solid var(--fuel-line)',
      '&:hover': {
        borderColor: 'var(--fuel-element-low-em)',
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
    fontFamily: '$mono',
    fontSize: '12px',
    wordWrap: 'break-word',
    minWidth: 0,
    color: '$textLow',
  }),
  usd: cssObj({
    fontFamily: '$mono',
    fontSize: '$sm',
    wordWrap: 'break-word',
    color: '$textHigh',
    ml: '$3',
  }),
  option: cssObj({
    alignItems: 'center',
    backgroundColor: '$cardBg',
    border: '1px solid var(--fuel-line)',
    color: '$textHigh',
    cursor: 'pointer',
    fontSize: '13px',
    gap: '$3',
    justifyContent: 'space-between',
    padding: '$3',
    transition: 'background-color 200ms, border-color 200ms',

    '@media (hover: hover)': {
      '&:hover': { backgroundColor: '$muted' },
    },
    '&:has([data-state="checked"])': {
      borderColor: '$intentsPrimary9',
    },
  }),
  optionContent: cssObj({
    color: '$textHigh',
  }),
  optionLabel: cssObj({
    color: '$textHigh',
    fontSize: '$sm !important',
    fontWeight: '$semibold',
    ml: '4px',
  }),
};
