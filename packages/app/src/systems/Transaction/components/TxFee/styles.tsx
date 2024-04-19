import { cssObj } from '@fuel-ui/css';

export const styles = {
  detailItem: (active: boolean) =>
    cssObj({
      padding: '$3 $4',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      display: 'flex',
      position: 'relative',

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
  text: cssObj({
    fontSize: '$sm',
    fontWeight: '$normal',
  }),
};
