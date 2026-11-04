import type { Transition } from 'framer-motion';

type Opts = Transition & {
  factor?: number;
  transition?: Transition;
};

/* The explorer's entrance: short distances on a fast ease out. */
const defaultTransition: Transition = {
  duration: 0.3,
  ease: [0.16, 1, 0.3, 1],
};

export const animations = {
  slideInTop: ({
    factor = 8,
    transition = defaultTransition,
  }: Opts = defaultTransition) => ({
    initial: { opacity: 0, y: -factor },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -factor },
    transition: { default: transition } as Transition,
  }),
  slideInRight: ({
    factor = 16,
    transition = defaultTransition,
  }: Opts = defaultTransition) => ({
    initial: { opacity: 0, x: factor },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: factor },
    transition: { default: transition } as Transition,
  }),
  fadeIn: ({ transition = defaultTransition }: Opts = defaultTransition) => ({
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { default: transition } as Transition,
  }),
};
