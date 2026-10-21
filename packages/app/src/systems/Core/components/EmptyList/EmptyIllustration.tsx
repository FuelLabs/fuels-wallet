import { cssObj, Box } from '@fuel-wallet/ui';
import type { CSSProperties } from 'react';

const ROWS = [
  { offset: '0px', width: 64 },
  { offset: '28px', width: 88 },
  { offset: '0px', width: 48 },
];

/**
 * Three ghost rows in the design system's hairline style. They rise in one
 * after another, and the middle one carries a pulsing square while it waits.
 */
export function EmptyIllustration() {
  return (
    <Box css={styles.root} aria-hidden>
      {ROWS.map((row, i) => (
        <Box
          key={row.width}
          className="fuel-rise"
          css={styles.row}
          style={
            {
              '--fuel-enter-delay': `${i * 80}ms`,
              marginLeft: row.offset,
            } as CSSProperties
          }
        >
          <Box css={styles.avatar} />
          <Box css={styles.lines}>
            <Box css={styles.line} style={{ width: row.width }} />
            <Box css={styles.lineShort} />
          </Box>
          {i === 1 && <span className="fuel-square" data-kind="active" />}
        </Box>
      ))}
    </Box>
  );
}

const styles = {
  root: cssObj({
    display: 'flex',
    flexDirection: 'column',
    gap: '$2',
    width: 200,
  }),
  row: cssObj({
    display: 'flex',
    alignItems: 'center',
    gap: '$3',
    width: 172,
    boxSizing: 'border-box',
    px: '$3',
    py: '10px',
    background: '$card',
    boxShadow: 'inset 0 0 0 1px var(--fuel-line)',
  }),
  avatar: cssObj({
    width: 24,
    height: 24,
    flexShrink: 0,
    background: '$muted',
    boxShadow: 'inset 0 0 0 1px var(--fuel-line)',
  }),
  lines: cssObj({
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    flex: 1,
  }),
  line: cssObj({
    height: 6,
    background: 'var(--fuel-element-low-em)',
    opacity: 0.35,
  }),
  lineShort: cssObj({
    width: 32,
    height: 6,
    background: 'var(--fuel-element-low-em)',
    opacity: 0.2,
  }),
};
