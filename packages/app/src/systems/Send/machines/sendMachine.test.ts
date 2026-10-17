import { bn } from 'fuels';
import { interpret } from 'xstate';
import { sendMachine } from './sendMachine';

const flush = async () => {
  for (let i = 0; i < 5; i++) await Promise.resolve();
};

describe('sendMachine', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('builds the tx 300 ms after the last input change', async () => {
    const createTransactionRequest = jest.fn(
      () => new Promise<never>(() => {})
    );
    const service = interpret(
      sendMachine
        .withConfig({
          actions: { goToHome: () => {}, callTransactionRequest: () => {} },
          services: {
            estimatingGasLimitAndDefaultTips: async () => ({
              regularTip: bn(1),
              fastTip: bn(2),
              maxGasLimit: bn(3),
            }),
            createTransactionRequest,
          },
        })
        .withContext({})
    ).start();
    await flush();
    expect(service.getSnapshot().matches('idle')).toBe(true);

    service.send({ type: 'SET_INPUT', input: { amount: bn(1) } });
    jest.advanceTimersByTime(299);
    expect(service.getSnapshot().matches('changingInput')).toBe(true);

    // A new keystroke restarts the delay
    service.send({ type: 'SET_INPUT', input: { amount: bn(2) } });
    jest.advanceTimersByTime(299);
    expect(service.getSnapshot().matches('changingInput')).toBe(true);
    expect(createTransactionRequest).not.toHaveBeenCalled();

    jest.advanceTimersByTime(1);
    expect(service.getSnapshot().matches('creatingTx')).toBe(true);
    expect(createTransactionRequest).toHaveBeenCalledTimes(1);
    expect(service.getSnapshot().context.input?.amount?.toNumber()).toBe(2);

    service.stop();
  });
});
