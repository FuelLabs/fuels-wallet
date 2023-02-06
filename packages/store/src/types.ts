/* eslint-disable @typescript-eslint/no-explicit-any */
import type { MaybeLazy } from '@xstate/react/lib/types';
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
export type Service<T extends MachinesObj> = InterpreterFrom<ValueOf<T>>;

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
  isBlackListed?: boolean;
};

export type Listener<T = unknown> = {
  key: string;
  listener(...args: T extends unknown[] ? T : T[]): void;
};
