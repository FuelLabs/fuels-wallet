import type { Transition } from 'framer-motion';

type Opts = Transition & {
  factor?: number;
  transition?: Transition;
};

const defaultTransition = {
  duration: '0.3',
  ease: 'easeInOut',
};

export const animations = {
  slideInTop: ({
    factor = 30,
    transition = defaultTransition,
  }: Opts = defaultTransition) => ({
    initial: { opacity: 0.4, y: -factor },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0.4, y: -factor },
    transition: { default: transition } as Transition,
  }),
  slideInRight: ({
    factor = 30,
    transition = defaultTransition,
  }: Opts = defaultTransition) => ({
    initial: { opacity: 0.4, x: factor },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0.4, x: factor },
    transition: { default: transition } as Transition,
  }),
};
