import { cssObj } from '@fuel-ui/css';

export const styles = {
  detailItem: (active = false, pointer = false, title = false) =>
    cssObj({
      padding: title ? '$3 $4' : '$3 $2',
      flexDirection: title ? 'row' : 'column',
      alignItems: 'flex-start',
      boxSizing: 'border-box',
      width: '100%',
      display: 'flex',
      columnGap: title ? '$4' : '$6',
      gap: title ? undefined : '$1',
      position: 'relative',
      cursor: pointer ? 'pointer' : 'auto',
      backgroundColor: '$cardBg',
      borderRadius: '8px',
      'html[class="fuel_light-theme"] &': {
        boxShadow: '0px 2px 6px -1px #2020201A, 0px 0px 0px 1px #2020201F',
      },
      'html[class="fuel_dark-theme"] &': {
        backgroundColor: '$gray2',
        border: '1px solid $gray3',
      },

      ...(active && {
        '&::after': {
          position: 'absolute',
          display: 'block',
          content: '""',
          top: 0,
          left: 0,
          width: '3px',
          height: '100%',
          background: '$intentsPrimary11',
          borderRadius: '$md 0 0 $md',
        },
      }),
    }),
  title: cssObj({
    fontSize: '$sm',
    lineHeight: '20px',
    fontWeight: '$medium',
    textWrap: 'nowrap',
  }),
  amount: cssObj({
    fontSize: '$sm',
    lineHeight: '20px',
    fontWeight: '$medium',
    wordWrap: 'break-word',
    minWidth: 0,
  }),
  usd: cssObj({
    fontSize: '$sm',
    lineHeight: '20px',
    fontWeight: '600',
    wordWrap: 'break-word',
    minWidth: 0,
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
    fontSize: '13px',
    fontWeight: '$medium',
  }),
};
