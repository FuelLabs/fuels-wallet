/* eslint-disable @typescript-eslint/no-explicit-any */
import type { MaybeLazy } from '@xstate/react/lib/types';
import type { WritableAtom } from 'jotai';
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
export type Handlers = Record<any, (...args: any[]) => any>;
export type MachinesObj = Record<string, AnyStateMachine>;

export type Machine<T extends MachinesObj> = StateMachine<
  ValueOf<T>['__TContext'],
  ValueOf<T>['__TStateSchema'],
  ValueOf<T>['__TEvent'],
  ValueOf<T>['__TTypestate'],
  ValueOf<T>['__TAction'],
  ValueOf<T>['__TServiceMap'],
  ValueOf<T>['__TResolvedTypesMeta']
>;

export type StateItem<T extends MachinesObj> = StateFrom<ValueOf<T>>;
export type MatchesState<M extends AnyStateMachine> =
  AreAllImplementationsAssumedToBeProvided<
    M['__TResolvedTypesMeta']
  > extends true
    ? keyof M['__TResolvedTypesMeta']['resolved']['matchesStates']
    : string;

export type Service<T extends MachinesObj> = InterpreterFrom<ValueOf<T>>;
export type StoreServiceObj<T extends MachinesObj> = {
  [K in keyof T]: Service<T>;
};

export interface MachineAtomOptions<TContext, TEvent extends EventObject> {
  context?: Partial<TContext>;
  state?: StateConfig<TContext, TEvent>;
}

export type InterpreterOptions<
  TMachine extends AnyStateMachine = AnyStateMachine
> = AreAllImplementationsAssumedToBeProvided<
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
  : InterpreterOptsRef &
      MachineAtomOptions<TMachine['__TContext'], TMachine['__TEvent']> &
      InternalMachineOptions<
        TMachine['__TContext'],
        TMachine['__TEvent'],
        TMachine['__TResolvedTypesMeta']
      >;

export type AddMachineParams<
  T extends MachinesObj,
  K extends keyof T = keyof T,
  M extends AnyStateMachine = ValueOf<T>
> = [id: K, machine: MaybeLazy<M>, opts: InterpreterOptions<ValueOf<T>>];

export type AddMachineInput<T extends MachinesObj> = {
  key: keyof T;
  getMachine: AddMachineParams<T, keyof T>[1];
  getOptions: AddMachineParams<T, keyof T>[2];
  hasStorage?: boolean;
};

export type Listener<Args extends unknown[] = unknown[]> = (
  ...args: Args
) => void;

export type StateListener<K, Args extends unknown[] = unknown[]> = {
  service: K extends string ? string : K;
  listener: Listener<Args>;
};

export type WaitForStateParam<M extends AnyStateMachine> =
  | MatchesState<M>
  | ((state: StateFrom<M>) => boolean);

export type WaitForArgs<
  T extends MachinesObj,
  K extends keyof T = keyof T,
  S extends Service<T> = Service<T>,
  M extends AnyStateMachine = S['machine']
> = [
  key: K extends string ? string : K,
  state: WaitForStateParam<M>,
  timeout?: number
];

export type WriteAtom<Value, Args extends unknown[]> = WritableAtom<
  Value,
  Args,
  Value
>;
