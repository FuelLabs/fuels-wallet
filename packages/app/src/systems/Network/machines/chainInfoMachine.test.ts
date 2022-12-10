import { graphql } from 'msw';
import { interpret } from 'xstate';
import { waitFor } from 'xstate/lib/waitFor';

import { MOCK_CHAIN_INFO } from '../__mocks__/chainInfo';

import type { ChainInfoMachineService } from './chainInfoMachine';
import { chainInfoMachine } from './chainInfoMachine';

import { mockServer } from '~/mocks/server';

const CHAIN_INFO_ID =
  '0xc7862855b418ba8f58878db434b21053a61a2025209889cc115989e8040ff077';

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

    service.send('FETCH_CHAIN_INFO', { input: { txId: CHAIN_INFO_ID } });

    await waitFor(service, (state) => state.matches('fetchingChainInfo'));
    await waitFor(service, (state) => state.matches('idle'));
    await waitFor(service, (state) => Boolean(state.context.chainInfo));
  });
});
