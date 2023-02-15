/* eslint-disable @typescript-eslint/no-explicit-any */
import type { MaybeLazy } from '@xstate/inspect';
import type {
  AnyStateMachine,
  AreAllImplementationsAssumedToBeProvided,
  EventObject,
  InternalMachineOptions,
  InterpreterFrom,
  InterpreterOptions as InterpreterOptsRef,
  StateConfig,
  StateFrom,
  StateMachine,
} from 'xstate';

export type ValueOf<T> = T[keyof T];
export type Handler = <Args extends any[]>(
  ...args: Args extends (infer T)[] ? T : []
) => any;

export type Handlers = {
  [K in string]: Handler;
};

export type MachinesObj = {
  [K in string]: AnyStateMachine;
};

export type Machine<M extends AnyStateMachine> = StateMachine<
  M['__TContext'],
  M['__TStateSchema'],
  M['__TEvent'],
  M['__TTypestate'],
  M['__TAction'],
  M['__TServiceMap'],
  M['__TResolvedTypesMeta']
>;

export type StateItem<
  T extends MachinesObj,
  K extends keyof T = keyof T
> = StateFrom<T[K]>;

export type MatchesState<M extends AnyStateMachine> =
  AreAllImplementationsAssumedToBeProvided<
    M['__TResolvedTypesMeta']
  > extends true
    ? keyof M['__TResolvedTypesMeta']['resolved']['matchesStates']
    : string;

export type Service<
  T extends MachinesObj,
  K extends keyof T = keyof T
> = InterpreterFrom<T[K]>;

export type StoreServiceObj<
  T extends MachinesObj,
  K extends keyof T = keyof T
> = {
  [P in K]: InterpreterFrom<T[P]>;
};

export interface MachineAtomOptions<TContext, TEvent extends EventObject> {
  context?: Partial<TContext>;
  state?: StateConfig<TContext, TEvent>;
}

export type InterpreterOptions<TMachine extends AnyStateMachine> =
  AreAllImplementationsAssumedToBeProvided<
    TMachine['__TResolvedTypesMeta']
  > extends false
    ? InterpreterOptsRef &
        MachineAtomOptions<TMachine['__TContext'], TMachine['__TEvent']> &
        InternalMachineOptions<
          TMachine['__TContext'],
          TMachine['__TEvent'],
          TMachine['__TResolvedTypesMeta'],
          true
        >
    : Partial<
        InterpreterOptsRef &
          MachineAtomOptions<TMachine['__TContext'], TMachine['__TEvent']> &
          InternalMachineOptions<
            TMachine['__TContext'],
            TMachine['__TEvent'],
            TMachine['__TResolvedTypesMeta']
          >
      >;

export type AddMachineInput<
  T extends MachinesObj = MachinesObj,
  K extends keyof T = keyof T
> = {
  key: K;
  getMachine: MaybeLazy<T[K]>;
  getOptions?: InterpreterOptions<T[K]>;
  hasStorage?: boolean;
};

export type Listener<Args extends unknown[] = unknown[]> = (
  ...args: Args
) => void;

export type StateListener<K, Args extends unknown[] = unknown[]> = {
  service: K;
  listener: Listener<Args>;
};

export type WaitForArgs<T extends MachinesObj, K extends keyof T> = [
  key: K,
  givenState: (state: StateFrom<T[K]>) => boolean,
  timeout?: number
];

export type WaitForStateArgs<T extends MachinesObj, K extends keyof T> = [
  key: K,
  config?: {
    done?: T[K]['__TResolvedTypesMeta']['resolved']['matchesStates'];
    failure?: T[K]['__TResolvedTypesMeta']['resolved']['matchesStates'];
    failureMessage?: StateFrom<T[K]>['context'];
    timeout?: number;
  }
];
