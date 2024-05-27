import { interpret } from 'xstate';
import { expectStateMatch } from '~/systems/Core/__tests__/utils';

import { MOCK_CUSTOM_ASSET, MOCK_NETWORK } from '../__mocks__/assets';

import { NetworkService } from '../../Network/services';
import type { AssetsMachineService } from './assetsMachine';
import { assetsMachine } from './assetsMachine';
const machine = assetsMachine.withContext({}).withConfig({
  actions: {
    navigateBack() {},
  },
});

describe('assetsMachine', () => {
  let service: AssetsMachineService;
  let state: ReturnType<AssetsMachineService['getSnapshot']>;

  beforeEach(async () => {
    await NetworkService.clearNetworks();
    await NetworkService.addNetwork({ data: MOCK_NETWORK });
    service = interpret(machine).start();
    state = service.getSnapshot();
  });

  afterEach(() => {
    service.stop();
    state = service.getSnapshot();
  });

  it('should reach idle state with initial assets set', async () => {
    state = await expectStateMatch(service, 'idle');

    expect(state.context.assets?.length).toBe(1);
  });

  it('should add/update/remove custom asset ', async () => {
    state = await expectStateMatch(service, 'idle');
    service.send('ADD_ASSET', { input: { data: MOCK_CUSTOM_ASSET } });
    state = await expectStateMatch(service, 'adding');
    state = await expectStateMatch(service, 'idle');
    const addedAsset = state.context.assets?.find(
      (asset) => asset.assetId === MOCK_CUSTOM_ASSET.assetId
    );
    expect(addedAsset).toBeDefined();

    const newName = 'Updated';
    service.send('UPDATE_ASSET', {
      input: {
        id: MOCK_CUSTOM_ASSET.assetId,
        data: { ...MOCK_CUSTOM_ASSET, name: newName },
      },
    });
    state = await expectStateMatch(service, 'updating');
    state = await expectStateMatch(service, 'idle');
    const updatedAsset = state.context.assets?.find(
      (asset) => asset.assetId === MOCK_CUSTOM_ASSET.assetId
    );
    expect(updatedAsset?.name).toEqual(newName);
    service.send('REMOVE_ASSET', {
      input: { assetId: MOCK_CUSTOM_ASSET.assetId },
    });
    state = await expectStateMatch(service, 'removing');
    state = await expectStateMatch(service, 'idle');
    const removedAsset = state.context.assets?.find(
      (asset) => asset.assetId === MOCK_CUSTOM_ASSET.assetId
    );
    expect(removedAsset).toBeUndefined();
  });
});
