import { cssObj } from '@fuel-wallet/ui';

export const operationsStyles = {
  drawer: cssObj({
    bg: '$cardBg',
    border: '1px solid var(--fuel-line)',
    marginBottom: '$2',
    overflow: 'hidden',
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
    fontFamily: '$mono',
    fontSize: '12px',
    lineHeight: '16px',
    letterSpacing: '0.6px',
    textTransform: 'uppercase',
    color: '$textLow',
  }),
  container: cssObj({
    padding: '1px',
    gap: '$2',
  }),
  cardStyle: cssObj({
    width: '100%',
    overflow: 'hidden',
    border: '1px solid var(--fuel-line)',
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
    gap: '2px',
  }),
  chevron: cssObj({
    transition: 'transform 0.3s ease',
    'html[class="fuel_dark-theme"] &': {
      color: '$gray12',
    },
    '&[data-expanded=true]': {
      transform: 'rotate(-180deg)',
    },
  }),
  contentCol: cssObj({
    display: 'flex',
    backgroundColor: '$bodyBg',
    'html[class="fuel_dark-theme"] &': {
      bg: '$gray3',
    },
    flex: 1,
    padding: '$4 $4 $4',
  }),
  spacer: cssObj({
    minHeight: '14px',
    width: '2px',
    height: '100%',
    backgroundColor: '$gray6',
    borderRadius: '$lg',
  }),
  iconCol: cssObj({
    // padding: '2px 0',
  }),
  badge: cssObj({
    padding: '2px $1',
    backgroundColor: '$gray3',
    borderRadius: '$md',
  }),
  name: cssObj({
    fontWeight: '$semibold',
    color: '$textHeading',
    mr: '$1',
  }),
  address: cssObj({
    fontWeight: '$medium',
    fontSize: '$sm',
    color: '$textSubText',
  }),
  blue: cssObj({
    fontSize: '$sm',
    display: 'flex',
    alignItems: 'center',
    gap: '$1',
    color: '$indigo10',
    lineHeight: 'normal',
  }),
  amountContainer: cssObj({
    fontWeight: '$semibold',
    color: '$textHeading',
    fontSize: '$sm',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: 'flex',
    flexDirection: 'column',
    gap: '$1',
  }),
  avatar: cssObj({
    // apply opacity to make the avatar color less alive and more opaque
    opacity: 0.6,
  }),
};
