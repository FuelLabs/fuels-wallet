import { interpret } from 'xstate';

import type { SignUpMachineService, SignUpMachineState } from './signUpMachine';
import { SignUpType, signUpMachine } from './signUpMachine';

function createMachine() {
  return signUpMachine.withContext({
    attempts: 0,
    type: SignUpType.create,
  });
}

describe('signUpMachine', () => {
  it('should be able to create a mnemonic', (done) => {
    const service = interpret(createMachine()).onTransition((state) => {
      if (state.matches('idle')) {
        expect(state.context.data?.mnemonic).toBeFalsy();
      }
      if (state.matches('showingMnemonic')) {
        expect(state.context.data?.mnemonic).toBeTruthy();
        done();
      }
    });

    service.start();
    service.send('CREATE_MNEMONIC');
  });

  function confirmMnemonic(service: SignUpMachineService, state: SignUpMachineState) {
    if (state.matches('showingMnemonic')) {
      service.send('NEXT');
    }
    if (state.matches('waitingMnemonic') && !state.context.isConfirmed) {
      const words = state.context.data?.mnemonic;
      service.send('CONFIRM_MNEMONIC', { data: { words } });
    }
  }

  it('should be able to confirm mnemonic', (done) => {
    const service = interpret(createMachine())
      .onTransition((state) => {
        confirmMnemonic(service, state);
      })
      .onChange((context) => {
        if (context.isConfirmed) {
          done();
        }
      });

    service.start();
    service.send('CREATE_MNEMONIC');
  });

  /**
   * TODO: I'm not able to create this scenario yet because of a lot of errors
   * from fuels-ts is happening here.
   */
  it('should be able to assign password and create wallet manager', () => {
    expect(true).toBe(true);
  });

  describe('type: create', () => {
    it('should go to idle after checking', (done) => {
      const service = interpret(createMachine()).onTransition((state) => {
        expect(state.matches('idle')).toBe(true);
        done();
      });
      service.start();
    });
  });

  describe('type: recover', () => {
    it('should go to waitingMnemonic after checking', (done) => {
      const machine = signUpMachine.withContext({
        attempts: 0,
        type: SignUpType.recover,
      });
      const service = interpret(machine).onTransition((state) => {
        expect(state.matches('waitingMnemonic')).toBe(true);
        done();
      });
      service.start();
    });
  });
});
