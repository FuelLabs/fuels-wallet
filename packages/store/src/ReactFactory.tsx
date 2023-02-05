import { useInterpret, useSelector as useSelectorRef } from '@xstate/react';
import { Provider, useAtomValue, useSetAtom } from 'jotai';
import type { ReactNode } from 'react';
import { useEffect } from 'react';
import type { StateFrom } from 'xstate';

import type { StateStorage } from './StateStorage';
import type { StartListener, StateListener } from './subscriberMachine';
import { createSubscriberMachine } from './subscriberMachine';
import type { CreateStoreAtomsReturn } from './utils';
import type { Service, MachinesObj, AddMachineParams } from './utils/types';

export type ReactFactoryOpts<T extends MachinesObj> =
  CreateStoreAtomsReturn<T> & {
    onStartListeners: Set<StartListener>;
    onStateListeners: Map<keyof T, Set<StateListener<T>>>;
    stateStorage: StateStorage<T>;
  };

export class ReactFactory<T extends MachinesObj> {
  readonly listeners = new Set<(state: Service<T>) => void>();
  constructor(readonly opts: ReactFactoryOpts<T>) {}

  createHooks() {
    const useSelector = this.createUseSelector();
    const useService = this.createUseService();
    const useSetMachineConfig = this.createUseSetMachine();
    return {
      useSelector,
      useService,
      useSetMachineConfig,
    };
  }

  createProvider() {
    const { store, servicesAtom } = this.opts;
    const { onStateListeners, onStartListeners, stateStorage } = this.opts;
    const subscriberMachine = createSubscriberMachine<T>().withContext({
      onStateListeners,
      onStartListeners,
      stateStorage,
      subscribers: [],
    });

    function Subscriber({ children }: { children: ReactNode }) {
      const service = useInterpret(subscriberMachine);
      const services = useAtomValue(servicesAtom);
      useEffect(() => {
        service.send('SUBSCRIBE', { input: { services } });
        return () => {
          service.send('UNSUBSCRIBE');
        };
      }, []);
      return <>{children}</>;
    }

    function StoreProvider({ children }: { children: ReactNode }) {
      return (
        <Provider store={store}>
          <Subscriber>{children}</Subscriber>
        </Provider>
      );
    }
    StoreProvider.displayName = 'StoreProvider';
    return StoreProvider;
  }

  // ---------------------------------------------------------------------------
  // Private methods
  // ---------------------------------------------------------------------------

  private createUseSelector() {
    const { serviceAtom } = this.opts;
    /**
     * A hook to be used as selector for a specific service.
     * @param key The key of the service to select from.
     * @param selector The selector function to select the value from the service.
     * @returns The selected value from the service.
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
    const { serviceAtom } = this.opts;
    /**
     * A hook to be used to get a specific service.
     * @param key The key of the service to get.
     * @returns The service.
     */
    return function useService(key: keyof T) {
      return useAtomValue(serviceAtom(key));
    };
  }

  private createUseSetMachine() {
    const { updateServiceAtom } = this.opts;
    /**
     * A hook to be used to update a specific service.
     * @param key The key of the service to update.
     * @param opts AddMachineParams<T>[2] - The options to update the service.
     * @returns The service.
     */
    return function useSetMachineConfig<K extends keyof T>(
      key: K,
      opts: AddMachineParams<T>[2]
    ) {
      const updateService = useSetAtom(updateServiceAtom);
      useEffect(() => {
        updateService(key, opts);
      }, [opts, key]);
    };
  }
}
