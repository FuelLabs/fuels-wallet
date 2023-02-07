import { useSelector as useSelectorRef } from '@xstate/react';
import { Provider, useAtom, useAtomValue } from 'jotai';
import type { ReactNode } from 'react';
import { useEffect } from 'react';
import type { AnyState, InterpreterFrom, StateFrom } from 'xstate';

import { atoms } from './atoms';
import type { MachinesObj, AddMachineParams } from './types';

export class ReactFactory<T extends MachinesObj> {
  createHooks() {
    const useSelector = this.createUseSelector();
    const useService = this.createUseService();
    const useState = this.createUseState();
    const useUpdateMachineConfig = this.createUseUpdateMachineConfig();
    const useWaitFor = this.createUseWaitFor();
    return {
      useState,
      useSelector,
      useService,
      useWaitFor,
      useUpdateMachineConfig,
    };
  }

  createProvider() {
    const { store } = atoms;
    function StoreProvider({ children }: { children: ReactNode }) {
      return <Provider store={store}>{children}</Provider>;
    }
    StoreProvider.displayName = 'StoreProvider';
    return StoreProvider;
  }

  // ---------------------------------------------------------------------------
  // Private methods
  // ---------------------------------------------------------------------------

  private createUseSelector() {
    const { serviceAtom } = atoms;
    /**
     * A hook to be used as selector for a specific service.
     * @param key The key of the service to select from.
     * @param selector The selector function to select the value from the service.
     * @returns The selected value from the service.
     * @example
     * const count = useSelector('counter', (state) => state.context.count);
     */
    return function useSelector<K extends keyof T, R>(
      key: K,
      selector: (state: StateFrom<T[K]>) => R
    ) {
      const service = useAtomValue(serviceAtom(key));
      return service && useSelectorRef(service, selector);
    };
  }

  private createUseService() {
    const { serviceAtom } = atoms;
    /**
     * A hook to be used to get a specific service.
     * @param key The key of the service to get.
     * @returns The service.
     * @example
     * const service = useService('counter');
     */
    return function useService<K extends keyof T>(key: K) {
      return useAtomValue(serviceAtom(key)) as InterpreterFrom<T[K]>;
    };
  }

  private createUseState() {
    const { stateAtom } = atoms;
    /**
     * A hook to be used to get a specific service state.
     * @param key The key of the service to get the state from.
     * @returns The service state.
     * @example
     * const [state, send] = useState('counter');
     */
    return function useState<K extends keyof T>(key: K) {
      return useAtom(stateAtom(key)) as [
        StateFrom<T[K]>,
        InterpreterFrom<T[K]>['send']
      ];
    };
  }

  private createUseUpdateMachineConfig() {
    const { serviceAtom } = atoms;
    /**
     * A hook to be used to update a specific service config.
     * @param key The key of the service to update.
     * @param opts AddMachineParams<T>[2] - The options to update the service.
     * @returns The service.
     * @example
     * useUpdateMachineConfig('counter', {
     *   actions: { ... }
     * });
     */
    return function useUpdateMachineConfig<K extends keyof T>(
      key: K,
      opts: AddMachineParams<T, K>[2]
    ) {
      const [, updateService] = useAtom(serviceAtom(key));
      useEffect(() => {
        updateService(opts);
      }, [opts, key]);
    };
  }

  private createUseWaitFor() {
    const { waitForAtom } = atoms;
    /**
     * A hook to be used to wait for a specific service state.
     * @param key The key of the service to wait for.
     * @param givenState - a predicate function that returns a boolean
     * @param timeout The timeout to wait for.
     * @returns The service state.
     * @example
     * const { data, status, error } = useWaitFor('counter', 'counting');
     * if (status === 'loading') return <div>Loading...</div>;
     * if (status === 'hasError') return <div>Error: {error}</div>;
     * return <div>Count: {data.context.value}</div>;
     */
    return function useWaitFor<K extends keyof T>(
      key: K,
      givenState: (state: StateFrom<T[K]>) => boolean,
      timeout?: number
    ) {
      const value = useAtomValue(
        waitForAtom(key, givenState as (state: AnyState) => boolean, timeout)
      );
      return {
        status: value.state,
        isLoading: value.state === 'loading',
        isError: value.state === 'hasError',
        data: value.state === 'hasData' ? value.data : null,
        error: value.state === 'hasError' ? value.error : null,
      };
    };
  }
}
