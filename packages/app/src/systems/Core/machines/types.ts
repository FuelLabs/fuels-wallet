import type { AnyStateMachine, StateFrom } from 'xstate';

export type ChildrenMachine<T extends { [key: string]: AnyStateMachine }> = {
  children: {
    [K in keyof T]?: {
      state: StateFrom<T[K]>;
    };
  };
};
