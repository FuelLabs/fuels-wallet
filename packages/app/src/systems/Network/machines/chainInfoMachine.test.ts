import { graphql } from 'msw';
import { interpret } from 'xstate';
import { waitFor } from 'xstate/lib/waitFor';
import { VITE_FUEL_PROVIDER_URL } from '~/config';
import { mockServer } from '~/mocks/server';

import { MOCK_CHAIN_INFO } from '../__mocks__/chainInfo';

import type { ChainInfoMachineService } from './chainInfoMachine';
import { chainInfoMachine } from './chainInfoMachine';

mockServer([
  graphql.query('getChain', (_req, res, ctx) => {
    return res(ctx.data(MOCK_CHAIN_INFO));
  }),
]);

describe('chainInfoMachine', () => {
  let service: ChainInfoMachineService;

  beforeEach(async () => {
    service = interpret(chainInfoMachine.withContext({})).start();
  });

  afterEach(() => {
    service.stop();
  });

  it('should fetch chainInfo', async () => {
    await waitFor(service, (state) => state.matches('idle'));

    service.send('FETCH_CHAIN_INFO', {
      input: { providerUrl: VITE_FUEL_PROVIDER_URL },
    });

    await waitFor(service, (state) => state.matches('fetchingChainInfo'));
    await waitFor(service, (state) => state.matches('idle'));
    await waitFor(service, (state) => Boolean(state.context.chainInfo));
  });
});
