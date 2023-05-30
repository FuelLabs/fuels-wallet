import { Mnemonic } from '@fuel-ts/mnemonic';
import { interpret } from 'xstate';

import { STORAGE_KEY } from '../components/SignUpProvider';

import type { SignUpMachineService, SignUpMachineState } from './signUpMachine';
import { SignUpType, signUpMachine } from './signUpMachine';

import { MNEMONIC_SIZE } from '~/config';
import { Storage } from '~/systems/Core';
import { expectStateMatch } from '~/systems/Core/__tests__/utils';

function createMachine() {
  return signUpMachine.withContext({});
}

describe('signUpMachine', () => {
  let service: SignUpMachineService;
  let state: SignUpMachineState;

  beforeEach(() => {
    service = interpret(createMachine()).start();
  });

  afterEach(() => {
    service.stop();
  });

  describe('type: create', () => {
    beforeEach(() => {
      Storage.setItem(STORAGE_KEY, SignUpType.create);
    });

    it('should be able to create a mnemonic', async () => {
      state = service.getSnapshot();
      expect(state.context.data?.mnemonic).toBeFalsy();
      service.send('CREATE_MNEMONIC');
      await expectStateMatch(service, 'showingMnemonic');
      state = service.getSnapshot();
      expect(state.context.data?.mnemonic).toBeTruthy();
    });

    it('should be able to confirm mnemonic', async () => {
      service.send('CREATE_MNEMONIC');
      await expectStateMatch(service, 'showingMnemonic');
      service.send('NEXT');
      await expectStateMatch(service, 'waitingMnemonic');

      state = service.getSnapshot();
      const words = state.context.data?.mnemonic;
      service.send('CONFIRM_MNEMONIC', { data: { words } });
      await expectStateMatch(service, 'waitingMnemonic.validMnemonic');
    });

    it('should be fail if mnemonic is invalid', async () => {
      service.send('CREATE_MNEMONIC');
      await expectStateMatch(service, 'showingMnemonic');
      service.send('NEXT');
      await expectStateMatch(service, 'waitingMnemonic');

      state = service.getSnapshot();
      const words = Array.from(state.context.data?.mnemonic || []);
      words[words.length - 1] = 'invalid-word';
      service.send('CONFIRM_MNEMONIC', { data: { words } });
      await expectStateMatch(service, 'waitingMnemonic.invalidMnemonic');
    });

    it('should be fail if mnemonic not matchs', async () => {
      service.send('CREATE_MNEMONIC');
      await expectStateMatch(service, 'showingMnemonic');
      service.send('NEXT');
      await expectStateMatch(service, 'waitingMnemonic');

      const words = Mnemonic.generate(MNEMONIC_SIZE).split(' ');
      service.send('CONFIRM_MNEMONIC', { data: { words } });
      await expectStateMatch(service, 'waitingMnemonic.mnemonicNotMatch');
    });
  });

  describe('type: recover', () => {
    beforeEach(() => {
      Storage.setItem(STORAGE_KEY, SignUpType.recover);
    });

    it('should be able to recover wallet using seed phrase', async () => {
      const machine = signUpMachine.withContext({});
      const service = interpret(machine).start();
      const words = Mnemonic.generate(MNEMONIC_SIZE).split(' ');
      service.send('CONFIRM_MNEMONIC', { data: { words } });
      await expectStateMatch(service, 'waitingMnemonic.validMnemonic');
      service.send('NEXT');
      await expectStateMatch(service, 'addingPassword');

      // This is not working, because fuels-ts is throwing an error
      // "TypeError: Cannot read properties of undefined (reading 'importKey')
      //
      // const password = 'password';
      // service.send('CREATE_MANAGER', { data: { password } });
      // expect(
      //   waitFor(service, (state) => state.matches('done'))
      // ).resolves.toBeTruthy();
    });
  });
});
