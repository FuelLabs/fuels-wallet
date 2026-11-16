import { keyframes } from './css';

/* Motion follows the explorer: opens ease out, closes are shorter and ease in.
 * Radix keeps a closing element mounted until its exit animation ends. Reduced
 * motion keeps the fades and drops every movement. */
export const fadeIn = keyframes({ from: { opacity: 0 }, to: { opacity: 1 } });
export const fadeOut = keyframes({ from: { opacity: 1 }, to: { opacity: 0 } });
export const dialogIn = keyframes({
  from: {
    opacity: 0,
    transform: 'translate(-50%, calc(-50% + 12px)) scale(0.98)',
  },
  to: { opacity: 1, transform: 'translate(-50%, -50%)' },
});
export const dialogOut = keyframes({
  from: { opacity: 1, transform: 'translate(-50%, -50%)' },
  to: {
    opacity: 0,
    transform: 'translate(-50%, calc(-50% + 12px)) scale(0.98)',
  },
});
const popIn = (y: string) =>
  keyframes({
    from: { opacity: 0, transform: `translateY(${y})` },
    to: { opacity: 1, transform: 'none' },
  });
const popUp = popIn('4px');
const popDown = popIn('-4px');

export const OPEN = '[data-state="open"]';
export const CLOSED = '[data-state="closed"]';
export const reduced = '@media (prefers-reduced-motion: reduce)';

/** A floating layer that drops from its anchor and fades out on close. */
export const popoverMotion = {
  transformOrigin: 'var(--radix-popper-transform-origin)',
  [`&${OPEN}, &[data-state="delayed-open"], &[data-state="instant-open"]`]: {
    animation: `${popDown} 160ms var(--fuel-ease-out)`,
  },
  [`&${OPEN}[data-side="top"], &[data-state$="-open"][data-side="top"]`]: {
    animation: `${popUp} 160ms var(--fuel-ease-out)`,
  },
  [`&${CLOSED}`]: {
    animation: `${fadeOut} 100ms var(--fuel-ease-in) forwards`,
  },
  [reduced]: {
    [`&${OPEN}, &[data-state$="-open"]`]: {
      animation: `${fadeIn} 150ms var(--fuel-ease-out)`,
    },
  },
};
