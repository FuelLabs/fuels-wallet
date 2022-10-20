import { toast } from '@fuel-ui/react';
import { interpret } from 'xstate';
import { waitFor } from 'xstate/lib/waitFor';

import type { CreateFetchMachineOpts } from './fetchMachine';
import { FetchMachine } from './fetchMachine';

const fetchForceSuccess = () => Promise.resolve('string');
const fetchForceError = async () => {
  throw new Error('force error');
};

const errorToastSpy = jest.spyOn(toast, 'error');

describe('fetchMachine', () => {
  const createService = (opts: CreateFetchMachineOpts<string, string>) => {
    jest.spyOn(console, 'error').mockImplementation();
    const fetchWrapper = { fetch: opts.fetch };
    const fetchSpy = jest.spyOn(fetchWrapper, 'fetch');
    const machine = FetchMachine.create({
      showError: true,
      maxAttempts: 3,
      ...opts,
      fetch: fetchWrapper.fetch,
    });
    const service = interpret(machine.withContext({})).start();

    return { fetchSpy, service };
  };

  afterEach(() => {
    errorToastSpy.mockClear();
  });

  it('should fail after attempting 1 time', async () => {
    const { fetchSpy, service } = createService({
      maxAttempts: 1,
      fetch: fetchForceError,
    });
    await waitFor(service, (state) => state.matches('failed'));
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });

  it('should fail after attempting 3 times', async () => {
    const { fetchSpy, service } = createService({
      maxAttempts: 3,
      fetch: fetchForceError,
    });
    await waitFor(service, (state) => state.matches('failed'));
    expect(fetchSpy).toHaveBeenCalledTimes(3);
  });

  it('should fail after attempting 5 times', async () => {
    const { fetchSpy, service } = createService({
      maxAttempts: 5,
      fetch: fetchForceError,
    });
    await waitFor(service, (state) => state.matches('failed'));
    expect(fetchSpy).toHaveBeenCalledTimes(5);
  });

  it('should show error when failing and showError: true', async () => {
    const errorToastSpy = jest.spyOn(toast, 'error');
    const { service } = createService({
      maxAttempts: 1,
      fetch: fetchForceError,
    });
    await waitFor(service, (state) => state.matches('failed'));
    expect(errorToastSpy).toHaveBeenCalledTimes(1);
  });

  it('should NOT show error when failing and showError: false', async () => {
    const { service } = createService({
      showError: false,
      maxAttempts: 1,
      fetch: fetchForceError,
    });
    await waitFor(service, (state) => state.matches('failed'));
    expect(errorToastSpy).toHaveBeenCalledTimes(0);
  });

  it('should work straight when has no errorNOT show error when failing and showError: false', async () => {
    const { fetchSpy, service } = createService({
      fetch: fetchForceSuccess,
    });
    await waitFor(service, (state) => state.matches('success'));
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(errorToastSpy).toHaveBeenCalledTimes(0);
  });
});
