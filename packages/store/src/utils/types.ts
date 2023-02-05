/* eslint-disable @typescript-eslint/no-explicit-any */
import type { MaybeLazy } from '@xstate/react/lib/types';
import type { Atom, createStore, WritableAtom } from 'jotai';
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

import type { AtomWithMachine } from './atomWithMachine';

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

export type StateItem<M extends AnyStateMachine> = StateFrom<M>;
export type Service<T extends MachinesObj> = InterpreterFrom<ValueOf<T>>;

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
  machine: AddMachineParams<T, keyof T>[1];
  opts: AddMachineParams<T, keyof T>[2];
};

// ----------------------------------------------------------------------------
// Jotai related types
// ----------------------------------------------------------------------------

export type JotaiStore = ReturnType<typeof createStore>;
export type AnyAtom = Atom<any> | WritableAtom<any, any[], any>;
export type MachineItemObj<T extends MachinesObj> = Record<
  keyof T,
  AtomWithMachine<Machine<T>, Service<T>>
>;

export type KeysAtom<T extends MachinesObj> = Atom<(keyof T)[]>;
export type MachinesObjAtom<T extends MachinesObj> = Atom<MachineItemObj<T>>;
export type MachinesAtom<T extends MachinesObj> = WritableAtom<
  MachineItemObj<T>,
  [AddMachineInput<T>],
  void
>;
