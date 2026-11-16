import { cssObj, Box, type ThemeUtilsCSS } from '@fuel-wallet/ui';
import { type CSSProperties, Fragment, useEffect, useState } from 'react';

export type StepperProps = {
  css?: ThemeUtilsCSS;
  steps: number;
  /** 1-based; past the last step means every step is done. */
  active?: number;
  labels?: string[];
};

/*
 * Each screen of the flow renders its own Stepper, so the last position is
 * kept here: a new screen mounts where the previous one left off and then
 * advances, which reads as one rail running through the whole flow.
 */
let lastActive = 0;

export function Stepper({ active = 1, steps, labels = [], css }: StepperProps) {
  const [shown, setShown] = useState(() => lastActive || active);
  const isDone = shown > steps;

  useEffect(() => {
    lastActive = active;
    const frame = requestAnimationFrame(() => setShown(active));
    return () => cancelAnimationFrame(frame);
  }, [active]);

  return (
    <Box
      as="ol"
      css={{ ...styles.root, ...css }}
      aria-label={isDone ? 'All steps complete' : `Step ${active} of ${steps}`}
      data-done={isDone}
    >
      {Array.from({ length: steps }).map((_, step) => {
        const index = step + 1;
        const state =
          shown > index ? 'done' : shown === index ? 'active' : 'todo';
        return (
          <Fragment key={index}>
            {index > 1 && (
              <li aria-hidden className="track" data-filled={shown >= index} />
            )}
            <li
              className="step"
              data-state={state}
              aria-current={state === 'active' ? 'step' : undefined}
              style={{ '--i': step } as CSSProperties}
            >
              <span className="square">
                <span className="number">{index}</span>
                <svg viewBox="0 0 16 16" aria-hidden className="check">
                  <path d="M3.5 8.5l3 3 6-7" pathLength={1} />
                </svg>
              </span>
              {labels[step] && <span className="label">{labels[step]}</span>}
            </li>
          </Fragment>
        );
      })}
    </Box>
  );
}

const SQUARE = 28;

/*
 * Advancing reads left to right: the finished square fills and ticks, the
 * track runs to the next square, then the next square lights up. Going back
 * skips the delays. When every step is done the squares flash in sequence.
 */
const styles = {
  root: cssObj({
    display: 'flex',
    alignItems: 'flex-start',
    width: '$full',
    margin: 0,
    padding: 0,
    listStyle: 'none',

    '.step': {
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '6px',
      width: SQUARE,
    },
    '.step:first-of-type': {
      alignItems: 'flex-start',
    },
    '.step:last-of-type': {
      alignItems: 'flex-end',
    },
    '.square': {
      position: 'relative',
      display: 'grid',
      placeItems: 'center',
      width: SQUARE,
      height: SQUARE,
      boxSizing: 'border-box',
      boxShadow: 'inset 0 0 0 1px var(--fuel-line)',
      fontFamily: '$mono',
      fontSize: '12px',
      color: '$textLow',
      transition:
        'background-color 250ms var(--fuel-ease-out), box-shadow 250ms var(--fuel-ease-out), color 250ms',
    },
    '.number': {
      transition: 'opacity 150ms, transform 250ms var(--fuel-ease-out)',
    },
    '.check': {
      position: 'absolute',
      width: 16,
      height: 16,
      fill: 'none',
      stroke: 'var(--fuel-primary-foreground)',
      strokeWidth: 2,
      strokeLinecap: 'square',
      strokeDasharray: 1,
      strokeDashoffset: 1,
      transition: 'stroke-dashoffset 300ms var(--fuel-ease-out) 120ms',
    },
    '.label': {
      fontFamily: '$mono',
      fontSize: '11px',
      lineHeight: '14px',
      letterSpacing: '0.04em',
      textTransform: 'uppercase',
      whiteSpace: 'nowrap',
      color: '$textLow',
      transition: 'color 250ms',
    },
    '.step[data-state="active"] .square': {
      boxShadow: 'inset 0 0 0 1px var(--fuel-primary)',
      color: '$textHigh',
      transitionDelay: '380ms',
    },
    '.step[data-state="active"] .label': {
      color: '$textHigh',
      transitionDelay: '380ms',
    },
    '.step[data-state="done"] .square': {
      backgroundColor: 'var(--fuel-primary)',
      boxShadow: 'inset 0 0 0 1px var(--fuel-primary)',
    },
    '.step[data-state="done"] .number': {
      opacity: 0,
      transform: 'scale(0.6)',
    },
    '.step[data-state="done"] .check': {
      strokeDashoffset: 0,
    },
    '.step[data-state="done"] .label': {
      color: '$textMid',
    },

    '.track': {
      position: 'relative',
      flex: 1,
      height: 1,
      marginTop: SQUARE / 2,
      background: 'var(--fuel-line)',
      overflow: 'hidden',

      '&::after': {
        content: '""',
        position: 'absolute',
        inset: 0,
        background: 'var(--fuel-primary)',
        transform: 'scaleX(0)',
        transformOrigin: 'left',
        transition: 'transform 200ms var(--fuel-ease-out)',
      },
    },
    '.track[data-filled="true"]::after': {
      transform: 'scaleX(1)',
      transition: 'transform 420ms var(--fuel-ease-out) 100ms',
    },

    '&[data-done="true"] .square': {
      animation: 'fuel-courier-hit 520ms var(--fuel-ease-out) backwards',
      animationDelay: 'calc(420ms + var(--i) * 70ms)',
    },

    '@media (prefers-reduced-motion: reduce)': {
      '.square, .number, .check, .label, .track::after': {
        transitionDuration: '0ms !important',
        transitionDelay: '0ms !important',
      },
      '&[data-done="true"] .square': {
        animation: 'none',
      },
    },
  }),
};
