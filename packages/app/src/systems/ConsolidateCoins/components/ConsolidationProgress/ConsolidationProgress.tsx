import { cssObj, Box, Text } from '@fuel-wallet/ui';
import type { CSSProperties } from 'react';
import { Layout } from '~/systems/Core';
import { useConsolidateCoinsSelector } from '../../hooks/useConsolidateCoinsSelector';
import type { ConsolidateCoinsMachineState } from '../../machines/consolidateCoinsMachine';
import type { ConsolidationStepStatus } from '../../services/consolidateCoins';

const selectors = {
  steps(state: ConsolidateCoinsMachineState) {
    return state.context.steps;
  },
  coins(state: ConsolidateCoinsMachineState) {
    return state.context.coins.length;
  },
  isFinished(state: ConsolidateCoinsMachineState) {
    return state.hasTag('consolidated');
  },
};

const SQUARE_KIND: Record<ConsolidationStepStatus, string | undefined> = {
  pending: 'idle',
  sending: 'active',
  done: undefined,
  failed: 'danger',
};

export function ConsolidationProgress() {
  const steps = useConsolidateCoinsSelector(selectors.steps);
  const coins = useConsolidateCoinsSelector(selectors.coins);
  const isFinished = useConsolidateCoinsSelector(selectors.isFinished);

  const total = steps.length;
  const done = steps.filter((status) => status === 'done').length;
  const sending = steps.indexOf('sending');
  const failed = isFinished ? total - done : 0;
  const isClean = isFinished && failed === 0;

  function title() {
    if (!isFinished) return 'Consolidating coins';
    if (isClean) return 'Coins consolidated';
    if (done === 0) return 'Consolidation failed';
    return 'Consolidation partly done';
  }

  function status() {
    if (!isFinished) {
      return `Transaction ${Math.max(sending, done) + 1} of ${total}`;
    }
    if (isClean) {
      return `${coins} coins combined in ${total} ${total === 1 ? 'transaction' : 'transactions'}.`;
    }
    return `${done} of ${total} transactions confirmed. The coins in the failed ones are unchanged, and Home will offer to consolidate them again.`;
  }

  return (
    <Layout.Content>
      <Box.Stack
        css={styles.root}
        className={isClean ? 'fuel-ticks' : undefined}
        data-finished={isFinished}
      >
        <Text as="h3" className="title">
          {title()}
        </Text>
        <Box as="ol" className="steps" aria-hidden>
          {steps.map((step, i) => (
            <li
              // biome-ignore lint/suspicious/noArrayIndexKey: one square per transaction, in order
              key={i}
              className="fuel-square"
              data-kind={SQUARE_KIND[step]}
              style={{ '--i': i } as CSSProperties}
            />
          ))}
        </Box>
        <Text role="status" className="status">
          {status()}
        </Text>
      </Box.Stack>
    </Layout.Content>
  );
}

/*
 * One square per transaction: idle, pulsing while it is sent, filled when it
 * confirms. When the run is clean the squares flash in order and corner
 * ticks snap onto the panel; a failure keeps its red square and says so.
 */
const styles = {
  root: cssObj({
    gap: '$4',
    mt: '$4',
    p: '$5',
    boxShadow: 'inset 0 0 0 1px var(--fuel-line)',

    '.title': {
      m: 0,
      fontWeight: '$semibold',
      color: '$textHeading',
    },
    '.steps': {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '6px',
      m: 0,
      p: 0,
      listStyle: 'none',
    },
    '.steps .fuel-square': {
      width: 16,
      height: 16,
      transition:
        'background-color 250ms var(--fuel-ease-out), border-color 250ms var(--fuel-ease-out)',
    },
    '.status': {
      fontFamily: '$mono',
      fontSize: '12px',
      lineHeight: '18px',
      color: '$textMid',
    },
    '&.fuel-ticks .steps .fuel-square': {
      animation: 'fuel-courier-hit 520ms var(--fuel-ease-out) backwards',
      animationDelay: 'calc(var(--i) * 50ms)',
    },

    '@media (prefers-reduced-motion: reduce)': {
      '.steps .fuel-square, &.fuel-ticks .steps .fuel-square': {
        animation: 'none',
        transition: 'none',
      },
    },
  }),
};
