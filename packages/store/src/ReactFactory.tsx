import { useSelector as useSelectorRef } from '@xstate/react';
import { Provider, useAtom, useAtomValue } from 'jotai';
import type { ReactNode } from 'react';
import { useEffect } from 'react';
import type { StateFrom } from 'xstate';

import { atoms } from './atoms';
import type { Service, MachinesObj, AddMachineParams } from './types';

export class ReactFactory<T extends MachinesObj> {
  readonly listeners = new Set<(state: Service<T>) => void>();

  createHooks() {
    const useSelector = this.createUseSelector();
    const useService = this.createUseService();
    const useState = this.createUseState();
    const useUpdateMachineConfig = this.createUseUpdateMachineConfig();
    return {
      useState,
      useSelector,
      useService,
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
      const service = useAtomValue(serviceAtom(key.toString()));
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
     * const [service, updateService] = useService('counter');
     */
    return function useService(key: keyof T) {
      return useAtom(serviceAtom(key.toString()));
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
    return function useState(key: keyof T) {
      return useAtom(stateAtom(key.toString()));
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
      opts: AddMachineParams<T>[2]
    ) {
      const [, updateService] = useAtom(serviceAtom(key.toString()));
      useEffect(() => {
        updateService(opts);
      }, [opts, key]);
    };
  }
}
