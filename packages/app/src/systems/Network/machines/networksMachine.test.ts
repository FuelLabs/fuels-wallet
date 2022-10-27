/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Network } from '@fuels-wallet/types';
import { interpret } from 'xstate';
import { waitFor } from 'xstate/lib/waitFor';

import { MOCK_NETWORKS } from '../__mocks__/networks';
import { NetworkService } from '../services';

import type { NetworksMachineService } from './networksMachine';
import { NetworkScreen, networksMachine } from './networksMachine';

const NETWORK = MOCK_NETWORKS[0];

const machine = networksMachine
  .withConfig({
    actions: {
      redirectToList() {},
      redirectToHome() {},
      notifyUpdateAccounts() {},
    },
  })
  .withContext({});

describe('networksMachine', () => {
  let service: NetworksMachineService;
  let state: ReturnType<NetworksMachineService['getSnapshot']>;

  beforeEach(async () => {
    await NetworkService.clearNetworks();
    await NetworkService.addNetwork({ data: NETWORK });
    service = interpret(machine).start();
    state = service.getSnapshot();
  });

  afterEach(() => {
    service.stop();
    state = service.getSnapshot();
  });

  it('should be on checking state by default', () => {
    expect(state.context.networks).toBeUndefined();
    expect(state.value).toBe('checking');
    expect(state.hasTag('loading')).toBeTruthy();
  });

  describe('list', () => {
    const initialEv: any = {
      type: 'SET_INITIAL_DATA',
      input: { type: NetworkScreen.list },
    };

    it('should fetch list of networks', async () => {
      const nextState = service.nextState(initialEv);
      expect(nextState.value).toBe('fetchingNetworks');

      service.send(initialEv);
      state = await waitFor(service, (state) => state.matches('idle'));
      expect(state.context.networks?.length).toBe(1);
    });

    it('should not have any network selected in context', async () => {
      service.send(initialEv);
      state = await waitFor(service, (state) => state.matches('idle'));
      expect(state.context.network).toBeFalsy();
    });
  });

  describe('add', () => {
    const initialEv: any = {
      type: 'SET_INITIAL_DATA',
      input: { type: NetworkScreen.add },
    };

    const addEv: any = {
      type: 'ADD_NETWORK',
      input: {
        data: MOCK_NETWORKS[1],
      },
    };

    it('should be in idle state if type list is passed', async () => {
      const nextState = service.nextState(initialEv);
      expect(nextState.value).toBe('idle');
    });

    it('should be able to add a new network', async () => {
      service.send(initialEv);
      state = await waitFor(service, (state) => state.matches('idle'));

      const nextState = service.nextState(addEv);
      expect(nextState.value).toBe('addingNetwork');
      expect(nextState.hasTag('loading')).toBeTruthy();

      service.send(addEv);
      state = await waitFor(service, (state) => state.matches('idle'));
      expect(state.context.networks?.length).toBe(2);
      const networkId = state.context.networks?.[1].id;
      await NetworkService.removeNetwork({ id: networkId as string });
    });

    it('should be able to remove a network', async () => {
      service.send(initialEv);
      service.send(addEv);
      state = await waitFor(service, (state) => state.matches('idle'));
      const networks = state.context.networks || [];
      const removeEv: any = {
        type: 'REMOVE_NETWORK',
        input: { id: networks[1]?.id },
      };

      const nextState = service.nextState(removeEv);
      expect(nextState.value).toBe('removingNetwork');

      service.send(removeEv);
      state = await waitFor(service, (state) => state.matches('idle'));
      expect(state.context.networks?.length).toBe(1);
    });

    it('should be able to select a new network', async () => {
      service.send(initialEv);
      service.send(addEv);
      state = await waitFor(service, (state) => state.matches('idle'));
      let networks = state.context.networks || [];
      const idx = networks.findIndex((n) => n.isSelected);
      const invertIdx = idx === 0 ? 1 : 0;
      expect(networks[idx]?.isSelected).toBeTruthy();
      expect(networks[invertIdx]?.isSelected).toBeFalsy();

      const selectEv: any = {
        type: 'SELECT_NETWORK',
        input: { id: networks[invertIdx]?.id },
      };

      const nextState = service.nextState(selectEv);
      expect(nextState.value).toBe('selectingNetwork');

      service.send(selectEv);
      await waitFor(service, (state) => state.matches('selectingNetwork'));
      state = await waitFor(service, (state) => state.matches('idle'));
      networks = state.context.networks || [];
      expect(networks[idx]?.isSelected).toBeFalsy();
      expect(networks[invertIdx]?.isSelected).toBeTruthy();
    });
  });

  describe('update', () => {
    let network: Network | undefined;
    let initialEv: any;

    beforeEach(async () => {
      initialEv = {
        type: 'SET_INITIAL_DATA',
        input: {
          type: NetworkScreen.update,
          networkId: network?.id as any,
        },
      };
    });

    it('should have networkId and network save on context', async () => {
      service.send(initialEv);
      expect(state.context.network).toBeUndefined();
      expect(state.context.networkId).toBeUndefined();

      state = await waitFor(service, (state) => state.matches('idle'));
      expect(state.context.network).toBeDefined();
      expect(state.context.networkId).toBe(network?.id);
    });

    it('should be able to update a network', async () => {
      service.send(initialEv);
      state = await waitFor(service, (state) => state.matches('idle'));
      const networks = state.context.networks || [];

      const updateEv: any = {
        type: 'UPDATE_NETWORK',
        input: {
          id: networks[0].id,
          data: {
            name: 'Test',
          },
        },
      };

      const nextState = service.nextState(updateEv);
      expect(nextState.value).toBe('updatingNetwork');

      service.send(updateEv);
      state = await waitFor(service, (state) => state.matches('idle'));
      expect(state.context.networks?.[0].name).toBe('Test');
    });
  });
});
