import type { AbiMap } from '@fuel-wallet/types';
import type { InterpreterFrom } from 'xstate';
import { interpret } from 'xstate';

import { mockAbi, MOCK_ABI_MAP } from '../__mocks__/abi';
import { AbiService } from '../services';

import { abiMachine } from './abiMachine';

import { expectStateMatch } from '~/systems/Core/__tests__';

describe('abiMachine', () => {
  let service: InterpreterFrom<typeof abiMachine>;

  beforeEach(async () => {
    mockAbi();
    service = interpret(abiMachine.withContext({})).start();
  });

  afterEach(() => {
    service.stop();
  });

  it('should get abiMap values', async () => {
    await expectStateMatch(service, 'idle');
    await service.send('REFRESH_ABIS');
    const state = await expectStateMatch(service, 'idle');

    expect(Object.keys(state.context.abiMap || []).length).toEqual(1);
    expect(
      state.context.abiMap?.[Object.keys(MOCK_ABI_MAP)[0]]
    ).not.toBeUndefined();
  });

  it('should update abiMap on refresh after adding other abi', async () => {
    await expectStateMatch(service, 'idle');

    const abiMap: AbiMap = Object.keys(MOCK_ABI_MAP).reduce((prev, key) => {
      const stack = {
        ...prev,
        [`${key.slice(0, -1)}z`]: MOCK_ABI_MAP[key],
      };
      return stack;
    }, {});

    await AbiService.addAbi({
      data: abiMap,
    });

    await service.send('REFRESH_ABIS');
    await expectStateMatch(service, 'fetchingAbis');
    const state = await expectStateMatch(service, 'idle');

    expect(Object.keys(state.context.abiMap || []).length).toEqual(2);
    expect(state.context.abiMap?.[Object.keys(abiMap)[0]]).not.toBeUndefined();
  });
});
