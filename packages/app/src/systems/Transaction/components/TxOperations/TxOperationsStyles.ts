import { cssObj } from '@fuel-ui/css';

export const operationsStyles = {
  drawer: cssObj({
    bg: '$gray5',
    borderRadius: '10px',
    marginBottom: '$2',
    overflow: 'hidden',
    'html[class="fuel_dark-theme"] &': {
      bg: '$gray2',
      border: '1px solid $gray3',
    },
  }),
  header: cssObj({
    display: 'flex',
    cursor: 'pointer',
    width: '100%',
    bg: 'transparent',
    padding: '0 $4',
    alignItems: 'center',
    border: 'none',
    minHeight: '36px',
  }),
  title: cssObj({
    letterSpacing: '-0.01em',
    color: '#646464',
    fontWeight: '$medium',
    fontSize: '13px',
  }),
  container: cssObj({
    padding: '2px',
    gap: '$2',
  }),
  cardStyle: cssObj({
    width: '100%',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0px 2px 6px -1px #2020201A, 0px 0px 0px 1px #2020201F',
  }),
  assetRow: cssObj({
    alignItems: 'center',
    gap: '$2',
  }),
  assetAmount: cssObj({
    fontSize: '14px',
    fontFamily: '$mono',
  }),
  noAssets: cssObj({
    color: '$gray10',
    fontSize: '$sm',
    fontStyle: 'italic',
  }),
  toggle: cssObj({
    display: 'flex',
    alignItems: 'center',
    gap: '$2',
    color: '$gray12',
  }),
  expandedOperations: cssObj({
    display: 'flex',
    flexDirection: 'column',
    padding: '2px',
    gap: '2px', // In the Design, it looks like they are touching, but that is not a border, but a shadow, so we need to add a gap
  }),
  chevron: cssObj({
    transition: 'all 0.2s ease',
    display: 'inline-block',
  }),
};
