import { bn } from 'fuels';
import { interpret } from 'xstate';
import { transactionRequestMachine } from './transactionRequestMachine';

describe('transactionRequestMachine', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('simulates 300 ms after the last fee change and shows loading meanwhile', () => {
    const simulateTransaction = jest.fn(() => new Promise<never>(() => {}));
    const service = interpret(
      transactionRequestMachine.withConfig({
        actions: { openDialog: () => {} },
        services: { simulateTransaction },
      })
    ).start('waitingApproval');

    service.send({ type: 'SET_CUSTOM_FEES', input: { tip: bn(1) } });
    jest.advanceTimersByTime(299);
    expect(service.getSnapshot().matches('changingCustomFees')).toBe(true);
    expect(service.getSnapshot().hasTag('loading')).toBe(true);

    // A new fee change restarts the delay
    service.send({ type: 'SET_CUSTOM_FEES', input: { tip: bn(2) } });
    jest.advanceTimersByTime(299);
    expect(service.getSnapshot().matches('changingCustomFees')).toBe(true);
    expect(simulateTransaction).not.toHaveBeenCalled();

    jest.advanceTimersByTime(1);
    expect(service.getSnapshot().matches('simulatingTransactionLoading')).toBe(
      true
    );
    expect(service.getSnapshot().hasTag('loading')).toBe(true);
    expect(simulateTransaction).toHaveBeenCalledTimes(1);

    service.stop();
  });
});
