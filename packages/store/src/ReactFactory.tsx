import { useSelector as useSelectorRef } from '@xstate/react';
import { Provider, useAtom, useAtomValue } from 'jotai';
import type { ReactNode } from 'react';
import { useMemo, useEffect } from 'react';
import type { InterpreterFrom, StateFrom } from 'xstate';

import type { CreateStoreAtomsReturn } from './atoms';
import type { MachinesObj, AddMachineInput } from './types';

export class ReactFactory<T extends MachinesObj> {
  readonly atoms!: CreateStoreAtomsReturn<T>;
  constructor(atoms: CreateStoreAtomsReturn<T>) {
    this.atoms = atoms;
  }

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
    const { store } = this.atoms;
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
    const { serviceAtom } = this.atoms;
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
      const atom = useMemo(() => serviceAtom(key), [key]);
      const service = useAtomValue(atom);
      return useSelectorRef(service, selector) as R;
    };
  }

  private createUseService() {
    const { serviceAtom } = this.atoms;
    /**
     * A hook to be used to get a specific service.
     * @param key The key of the service to get.
     * @returns The service.
     * @example
     * const service = useService('counter');
     */
    return function useService<K extends keyof T>(key: K) {
      const atom = useMemo(() => serviceAtom(key), [key]);
      return useAtomValue(atom);
    };
  }

  private createUseState() {
    const { stateAtom } = this.atoms;
    /**
     * A hook to be used to get a specific service state.
     * @param key The key of the service to get the state from.
     * @returns The service state.
     * @example
     * const [state, send] = useState('counter');
     */
    return function useState<K extends keyof T>(key: K) {
      const atom = useMemo(() => stateAtom(key), [key]);
      return useAtom(atom) as [StateFrom<T[K]>, InterpreterFrom<T[K]>['send']];
    };
  }

  private createUseUpdateMachineConfig() {
    const { serviceAtom } = this.atoms;
    /**
     * A hook to be used to update a specific service config.
     * @param key The key of the service to update.
     * @param opts InterpreterOpts<M> - The options to update the service.
     * @returns The service.
     * @example
     * useUpdateMachineConfig('counter', {
     *   actions: { ... }
     * });
     */
    return function useUpdateMachineConfig<K extends keyof T>(
      key: K,
      opts: Partial<AddMachineInput<T, K>['getOptions']> = {}
    ) {
      const atom = useMemo(() => serviceAtom(key), [key]);
      const [service, updateService] = useAtom(atom);
      useEffect(() => {
        updateService(opts);
      }, [opts, key]);
      return service as InterpreterFrom<T[K]>;
    };
  }
}
