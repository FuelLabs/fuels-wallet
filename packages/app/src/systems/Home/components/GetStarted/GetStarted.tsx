import { cssObj, Box, Icon, IconButton, Text } from '@fuel-wallet/ui';
import { type CSSProperties, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pages } from '~/systems/Core';

import { MOMENT_MS, type Milestone } from '../../hooks/useGetStarted';

/* Taken from the asset list below, so Home still fits without scrolling. */
export const GET_STARTED_HEIGHT = 44;

const LABELS: Record<Milestone, { done: string; next: string }> = {
  secured: { done: 'Wallet secured', next: 'Secure your wallet' },
  pinned: { done: 'Pinned to toolbar', next: 'Pin to your toolbar' },
  funded: { done: 'Funds received', next: 'Receive your first funds' },
  connected: { done: 'App connected', next: 'Connect to an app' },
};

export type GetStartedProps = {
  milestones: { milestone: Milestone; isDone: boolean }[];
  isFirstFunds: boolean;
  onDismiss: () => void;
};

export function GetStarted({
  milestones,
  isFirstFunds,
  onDismiss,
}: GetStartedProps) {
  const navigate = useNavigate();
  const done = milestones.filter((item) => item.isDone).length;
  const isAllSet = done === milestones.length;
  const next = milestones.find((item) => !item.isDone)?.milestone;

  // biome-ignore lint/correctness/useExhaustiveDependencies: settles once
  useEffect(() => {
    if (!isAllSet) return;
    const timer = setTimeout(onDismiss, MOMENT_MS);
    return () => clearTimeout(timer);
  }, [isAllSet]);

  function message() {
    if (isAllSet) return <Text className="message">All set</Text>;
    if (isFirstFunds) {
      return <Text className="message">First funds received</Text>;
    }
    const label = next ? LABELS[next].next : '';
    return (
      <Text className="message">
        <span className="count">
          {done}/{milestones.length}
        </span>
        {next === 'funded' ? (
          <button
            type="button"
            className="next"
            onClick={() => navigate(Pages.receive())}
          >
            {label}
          </button>
        ) : (
          <span className="next">{label}</span>
        )}
      </Text>
    );
  }

  return (
    <Box
      as="section"
      aria-label="Get started"
      css={styles.root}
      data-all-set={isAllSet}
      data-first-funds={isFirstFunds}
    >
      <Box as="ol" className="squares">
        {milestones.map(({ milestone, isDone }, i) => (
          <li
            key={milestone}
            className="fuel-square"
            data-kind={isDone ? undefined : 'idle'}
            data-milestone={milestone}
            aria-label={`${LABELS[milestone].done}${isDone ? '' : ', to do'}`}
            style={{ '--i': i } as CSSProperties}
          />
        ))}
      </Box>
      <Box role="status" className="status">
        {message()}
      </Box>
      {!isAllSet && (
        <IconButton
          icon={Icon.is('X')}
          aria-label="Dismiss get started"
          variant="link"
          onPress={onDismiss}
        />
      )}
    </Box>
  );
}

/*
 * A quiet strip under the actions: one square per milestone. A deposit pops
 * its square while the balance above takes the ticks; finishing the last one
 * flashes the row, says "All set" and lets the strip go.
 */
const styles = {
  root: cssObj({
    display: 'flex',
    alignItems: 'center',
    gap: '$3',
    height: GET_STARTED_HEIGHT,
    boxSizing: 'border-box',
    mx: '$4',
    mb: '$3',
    px: '$3',
    boxShadow: 'inset 0 0 0 1px var(--fuel-line)',
    animation: 'fuel-appear 300ms var(--fuel-ease-out) backwards',

    '.squares': {
      display: 'flex',
      gap: '4px',
      m: 0,
      p: 0,
      listStyle: 'none',
    },
    '.fuel-square': {
      transition:
        'background-color 250ms var(--fuel-ease-out), border-color 250ms var(--fuel-ease-out)',
    },
    '.status': {
      flex: 1,
      minWidth: 0,
    },
    '.message': {
      display: 'flex',
      alignItems: 'center',
      gap: '$2',
      fontSize: '$sm',
      color: '$textHigh',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      animation: 'fuel-appear 200ms var(--fuel-ease-out) backwards',
    },
    '.count': {
      fontFamily: '$mono',
      fontSize: '12px',
      color: '$textLow',
    },
    '.next': {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      color: '$textMid',
    },
    'button.next': {
      p: 0,
      border: 'none',
      background: 'none',
      font: 'inherit',
      color: '$textHigh',
      cursor: 'pointer',
      textDecoration: 'underline',
      textUnderlineOffset: '3px',
      textDecorationColor: 'var(--fuel-line)',
    },
    '&[data-first-funds="true"] [data-milestone="funded"]': {
      animation: 'fuel-pop 520ms var(--fuel-ease-out) both',
    },
    '&[data-all-set="true"] .fuel-square': {
      animation: 'fuel-courier-hit 520ms var(--fuel-ease-out) backwards',
      animationDelay: 'calc(var(--i) * 70ms)',
    },

    '@media (prefers-reduced-motion: reduce)': {
      '&, .message, .fuel-square, &[data-first-funds="true"] [data-milestone="funded"], &[data-all-set="true"] .fuel-square':
        {
          animation: 'none',
          transition: 'none',
        },
    },
  }),
};
