import { interpret } from 'xstate';
import { EcosystemService } from '~/systems/Ecosystem/services/ecosystem';

import type { ContractsMachineService } from './contractsMachine';
import { contractsMachine } from './contractsMachine';

describe('contractsMachine', () => {
  let service: ContractsMachineService;
  let fetchProjects: jest.SpyInstance;

  beforeEach(() => {
    jest.useFakeTimers();
    jest.spyOn(console, 'error').mockImplementation(() => {});
    fetchProjects = jest
      .spyOn(EcosystemService, 'fetchProjects')
      .mockRejectedValue(new Error('offline'));
    service = interpret(contractsMachine).start();
  });

  afterEach(() => {
    service.stop();
    jest.restoreAllMocks();
    jest.useRealTimers();
  });

  it('does not fetch projects until requested', async () => {
    await jest.advanceTimersByTimeAsync(60_000);
    expect(fetchProjects).not.toHaveBeenCalled();
  });

  it('retries with backoff and stops after 3 attempts', async () => {
    service.send({ type: 'FETCH' });
    await jest.advanceTimersByTimeAsync(0);
    expect(fetchProjects).toHaveBeenCalledTimes(1);

    await jest.advanceTimersByTimeAsync(10_000);
    expect(fetchProjects).toHaveBeenCalledTimes(2);

    await jest.advanceTimersByTimeAsync(10_000);
    expect(fetchProjects).toHaveBeenCalledTimes(2);
    await jest.advanceTimersByTimeAsync(10_000);
    expect(fetchProjects).toHaveBeenCalledTimes(3);

    await jest.advanceTimersByTimeAsync(10 * 60_000);
    expect(fetchProjects).toHaveBeenCalledTimes(3);
    expect(service.getSnapshot().matches('failed')).toBe(true);
  });
});
