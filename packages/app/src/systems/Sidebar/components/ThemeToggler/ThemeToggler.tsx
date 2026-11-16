import { cssObj, Box, Icon, useFuelTheme } from '@fuel-wallet/ui';

export function ThemeToggler() {
  const { current, setTheme } = useFuelTheme();
  const next = current === 'dark' ? 'light' : 'dark';

  return (
    <Box
      as="button"
      type="button"
      data-theme={current}
      aria-label={`Switch to ${next} theme`}
      css={styles.root}
      onClick={() => setTheme(next)}
    >
      <Icon icon="SunFilled" size={16} />
      <Icon icon="MoonStars" size={16} />
    </Box>
  );
}

/* The two icons share one spot. The incoming one turns in while the other turns out. */
const styles = {
  root: cssObj({
    position: 'relative',
    display: 'grid',
    placeItems: 'center',
    width: '32px',
    height: '32px',
    p: 0,
    border: 'none',
    background: 'transparent',
    color: '$textLow',
    cursor: 'pointer',
    boxShadow: 'inset 0 0 0 1px var(--fuel-line)',
    transition: 'background-color 300ms, color 200ms',

    '@media (hover: hover)': {
      '&:hover': { background: '$muted', color: '$textHigh' },
    },
    '&:focus-visible': {
      outline: '2px solid $focus',
      outlineOffset: '2px',
    },

    '.fuel_Icon': {
      gridArea: '1 / 1',
      transition:
        'transform 300ms var(--fuel-ease-out), opacity 200ms var(--fuel-ease-out)',
    },
    '&[data-theme="light"] [aria-label*="MoonStars"], &[data-theme="dark"] [aria-label*="SunFilled"]':
      {
        opacity: 0,
        transform: 'rotate(-90deg) scale(0.6)',
      },
    '@media (prefers-reduced-motion: reduce)': {
      '.fuel_Icon': { transition: 'opacity 150ms' },
      '&[data-theme] .fuel_Icon': { transform: 'none' },
    },
  }),
};
