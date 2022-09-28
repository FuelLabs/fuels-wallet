import { interpret } from 'xstate';
import { waitFor } from 'xstate/lib/waitFor';

import type { SignUpMachineService, SignUpMachineState } from './signUpMachine';
import { SignUpType, signUpMachine } from './signUpMachine';

function createMachine() {
  return signUpMachine.withContext({
    attempts: 0,
    type: SignUpType.create,
  });
}

describe('signUpMachine', () => {
  let service: SignUpMachineService;
  let state: SignUpMachineState;

  beforeEach(() => {
    service = interpret(createMachine()).start();
    state = service.getSnapshot();
  });

  afterEach(() => {
    service.stop();
    state = service.getSnapshot();
  });

  it('should be able to create a mnemonic', async () => {
    expect(state.context.data?.mnemonic).toBeFalsy();
    service.send('CREATE_MNEMONIC');

    state = await waitFor(service, (state) => state.matches('showingMnemonic'));
    expect(state.context.data?.mnemonic).toBeTruthy();
  });

  it('should be able to confirm mnemonic', async () => {
    service.send('CREATE_MNEMONIC');
    state = await waitFor(service, (state) => state.matches('showingMnemonic'));
    service.send('NEXT');
    state = await waitFor(service, (state) => state.matches('waitingMnemonic'));

    const words = state.context.data?.mnemonic;
    service.send('CONFIRM_MNEMONIC', { data: { words } });
    expect(state.value).toBe('waitingMnemonic');
    service.send('NEXT');

    state = await waitFor(service, (state) => state.matches('addingPassword'));
    expect(state.context.isConfirmed).toBe(true);
  });

  /**
   * TODO: I'm not able to create this scenario yet because of a lot of errors
   * from fuels-ts is happening here.
   */
  it('should be able to assign password and create wallet manager', () => {
    expect(true).toBe(true);
  });

  describe('type: create', () => {
    it('should go to idle after checking', () => {
      expect(state.value).toBe('idle');
    });
  });

  describe('type: recover', () => {
    it('should go to waitingMnemonic after checking', () => {
      const machine = signUpMachine.withContext({
        attempts: 0,
        type: SignUpType.recover,
      });

      service = interpret(machine).start();
      state = service.getSnapshot();
      expect(state.value).toBe('waitingMnemonic');
    });
  });
});
