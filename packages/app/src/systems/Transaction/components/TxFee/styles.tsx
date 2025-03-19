import { cssObj } from '@fuel-ui/css';

export const styles = {
  detailItem: (active = false, pointer = false, title = false) =>
    cssObj({
      padding: title ? '$3 $4' : '$2 $6',
      flexDirection: title ? 'row' : 'column',
      justifyContent: 'space-between',
      alignItems: title ? 'center' : 'flex-start',
      display: 'flex',
      columnGap: title ? '$4' : '$6',
      gap: title ? undefined : '$1',
      position: 'relative',
      cursor: pointer ? 'pointer' : 'auto',

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
};
