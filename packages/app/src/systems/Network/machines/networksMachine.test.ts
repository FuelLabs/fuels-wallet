import type { NetworkData } from '@fuel-wallet/types';
import { interpret } from 'xstate';
import { waitFor } from 'xstate/lib/waitFor';
import { expectStateMatch } from '~/systems/Core/__tests__/utils';

import { MOCK_NETWORKS } from '../__mocks__/networks';
import { NetworkService } from '../services';

import type { NetworksMachineService } from './networksMachine';
import { networksMachine } from './networksMachine';

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

  it('should be on fetchingNetworks state by default', () => {
    expect(state.context.networks).toBeUndefined();
    expect(state.value).toBe('fetchingNetworks');
    expect(state.hasTag('loading')).toBeTruthy();
  });

  describe('list', () => {
    it('should fetch list of networks', async () => {
      state = await expectStateMatch(service, 'idle');
      expect(state.context.networks?.length).toBe(1);
    });

    it('should have one network selected in context', async () => {
      state = await expectStateMatch(service, 'idle');
      expect(state.context.network).toBeDefined();
    });
  });

  describe('add', () => {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const addEv: any = {
      type: 'ADD_NETWORK',
      input: {
        data: MOCK_NETWORKS[1],
      },
    };

    it('should be able to remove a network', async () => {
      await expectStateMatch(service, 'idle');

      service.send(addEv);
      state = await expectStateMatch(service, 'idle');
      const networks = state.context.networks || [];

      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      const removeEv: any = {
        type: 'REMOVE_NETWORK',
        input: { id: networks[1]?.id },
      };

      const nextState = service.nextState(removeEv);
      expect(nextState.value).toBe('removingNetwork');

      service.send(removeEv);
      state = await expectStateMatch(service, 'idle');
      expect(state.context.networks?.length).toBe(1);
    });

    it('should be able to add a new network', async () => {
      state = await expectStateMatch(service, 'idle');

      const nextState = service.nextState(addEv);
      expect(nextState.value).toBe('addingNetwork');
      expect(nextState.hasTag('loading')).toBeTruthy();

      service.send(addEv);
      state = await expectStateMatch(service, 'idle');
      const networks = state.context.networks || [];
      expect(networks?.length).toBe(2);
      const networkId = networks?.[1].id;
      await NetworkService.removeNetwork({ id: networkId as string });
    });

    it('should be able to select a new network', async () => {
      await expectStateMatch(service, 'idle');

      service.send(addEv);
      state = await expectStateMatch(service, 'idle');

      let networks = state.context.networks || [];
      const idx = networks.findIndex((n) => n.isSelected);
      const invertIdx = idx === 0 ? 1 : 0;
      expect(networks[idx]?.isSelected).toBeTruthy();
      expect(networks[invertIdx]?.isSelected).toBeFalsy();
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      const selectEv: any = {
        type: 'SELECT_NETWORK',
        input: { id: networks[invertIdx]?.id },
      };

      const nextState = service.nextState(selectEv);
      expect(nextState.value).toBe('selectingNetwork');

      service.send(selectEv);
      await expectStateMatch(service, 'selectingNetwork');
      state = await expectStateMatch(service, 'idle');
      networks = state.context.networks || [];
      expect(networks[idx]?.isSelected).toBeFalsy();
      expect(networks[invertIdx]?.isSelected).toBeTruthy();
    });
  });

  describe('update', () => {
    let network: NetworkData | undefined;
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    let editEv: any;

    beforeEach(async () => {
      editEv = {
        type: 'EDIT_NETWORK',
        input: {
          // biome-ignore lint/suspicious/noExplicitAny: <explanation>
          id: network?.id as any,
        },
      };
    });

    it('should have networkId and network save on context', async () => {
      service.send(editEv);
      expect(state.context.network).toBeUndefined();
      expect(state.context.networkId).toBeUndefined();

      state = await waitFor(service, (state) => state.matches('idle'));
      expect(state.context.network).toBeDefined();
      expect(state.context.networkId).toBe(network?.id);
    });

    it('should be able to update a network', async () => {
      state = await expectStateMatch(service, 'idle');
      const networks = state.context.networks || [];

      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
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
