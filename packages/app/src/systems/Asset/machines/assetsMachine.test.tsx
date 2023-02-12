import { interpret } from 'xstate';

import { MOCK_CUSTOM_ASSET } from '../__mocks__/assets';

import type { AssetsMachineService } from './assetsMachine';
import { assetsMachine } from './assetsMachine';

import { expectStateMatch } from '~/systems/Core/__tests__/utils';

const machine = assetsMachine.withContext({}).withConfig({
  actions: {
    navigateBack() {},
  },
});

describe('assetsMachine', () => {
  let service: AssetsMachineService;
  let state: ReturnType<AssetsMachineService['getSnapshot']>;

  beforeEach(async () => {
    service = interpret(machine).start();
    state = service.getSnapshot();
  });

  afterEach(() => {
    service.stop();
    state = service.getSnapshot();
  });

  it('should reach idle state with initial assets set', async () => {
    state = await expectStateMatch(service, 'idle');

    expect(state.context.assets?.length).toBe(3);
  });

  it('should save/remove custom asset ', async () => {
    state = await expectStateMatch(service, 'idle');
    service.send('UPSERT_ASSET', { input: { data: MOCK_CUSTOM_ASSET } });
    state = await expectStateMatch(service, 'saving');
    state = await expectStateMatch(service, 'idle');
    const addedAsset = state.context.assets?.find(
      (asset) => asset.assetId === MOCK_CUSTOM_ASSET.assetId
    );
    expect(addedAsset).toBeDefined();
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
