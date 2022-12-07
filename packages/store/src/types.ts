/* eslint-disable @typescript-eslint/no-explicit-any */
import type { UseMachineOptions } from '@xstate/react/lib/types';
import type {
  AnyInterpreter,
  AnyStateMachine,
  AreAllImplementationsAssumedToBeProvided,
  InternalMachineOptions,
  InterpreterFrom,
  InterpreterOptions,
  MachineOptions,
  StateFrom,
  StateMachine,
} from 'xstate';

export type ArrayType<T> = T extends (infer Item)[] ? Item[] : T;
export type ValueOf<T> = T[keyof T];

export type Events = {
  [K in string]: (...args: any[]) => any;
};

export type MachinesObj = Record<string, () => AnyStateMachine>;
export type ServicesObj = Record<string, AnyInterpreter>;
export type StateObj<T extends MachinesObj> = Record<
  keyof T,
  StateFrom<
    StateMachine<
      ReturnType<ValueOf<T>>['__TContext'],
      ReturnType<ValueOf<T>>['__TStateSchema'],
      ReturnType<ValueOf<T>>['__TEvent'],
      ReturnType<ValueOf<T>>['__TTypestate'],
      ReturnType<ValueOf<T>>['__TAction'],
      ReturnType<ValueOf<T>>['__TServiceMap'],
      ReturnType<ValueOf<T>>['__TResolvedTypesMeta']
    >
  >
>;
export type Service<T extends MachinesObj> = InterpreterFrom<
  StateMachine<
    ReturnType<ValueOf<T>>['__TContext'],
    ReturnType<ValueOf<T>>['__TStateSchema'],
    ReturnType<ValueOf<T>>['__TEvent'],
    ReturnType<ValueOf<T>>['__TTypestate'],
    ReturnType<ValueOf<T>>['__TAction'],
    ReturnType<ValueOf<T>>['__TServiceMap'],
    ReturnType<ValueOf<T>>['__TResolvedTypesMeta']
  >
> & {
  __storeKey: keyof T;
};

/**
 * This types were heavylly inspired copied on @xstate/react types
 */
export type Opts<T extends AnyStateMachine> = Partial<InterpreterOptions> &
  Partial<UseMachineOptions<T['__TContext'], T['__TEvent']>> &
  Partial<
    MachineOptions<
      T['__TContext'],
      T['__TEvent'],
      T['__TAction'],
      T['__TServiceMap'],
      T['__TResolvedTypesMeta']
    >
  >;

export type RestParams<TMachine extends AnyStateMachine> =
  AreAllImplementationsAssumedToBeProvided<
    TMachine['__TResolvedTypesMeta']
  > extends false
    ? [
        options: InterpreterOptions &
          UseMachineOptions<TMachine['__TContext'], TMachine['__TEvent']> &
          InternalMachineOptions<
            TMachine['__TContext'],
            TMachine['__TEvent'],
            TMachine['__TResolvedTypesMeta'],
            true
          >
      ]
    : [
        options?: InterpreterOptions &
          UseMachineOptions<TMachine['__TContext'], TMachine['__TEvent']> &
          InternalMachineOptions<
            TMachine['__TContext'],
            TMachine['__TEvent'],
            TMachine['__TResolvedTypesMeta']
          >
      ];
