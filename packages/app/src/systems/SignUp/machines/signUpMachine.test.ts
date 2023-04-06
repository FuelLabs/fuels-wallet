import { Mnemonic } from 'fuels';
import { interpret } from 'xstate';

import type { SignUpMachineService, SignUpMachineState } from './signUpMachine';
import { SignUpType, signUpMachine } from './signUpMachine';

import { MNEMONIC_SIZE } from '~/config';
import { Storage, db } from '~/systems/Core';
import { expectStateMatch } from '~/systems/Core/__tests__/utils';

function createMachine() {
  return signUpMachine.withContext({
    type: SignUpType.create,
  });
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
    it('should create and save mnemonic after creating a password', async () => {
      service.send('NEXT');
      await expectStateMatch(service, 'addingPassword');
      service.send('CREATE_PASSWORD', { data: { password: 'Password@1' } });
      await expectStateMatch(service, 'showingMnemonic');
      state = service.getSnapshot();
      expect(state.context.data?.mnemonic).toBeTruthy();
    });

    it('should resume from saved mnemonic', async () => {
      await expectStateMatch(service, 'waitingMnemonic');
      state = service.getSnapshot();
      expect(state.context.data?.mnemonic).toBeTruthy();
    });

    it('should be fail confirmation if mnemonic confirmation does not match', async () => {
      await expectStateMatch(service, 'waitingMnemonic');
      state = service.getSnapshot();
      const words = state.context.data?.mnemonic;
      const positionsForConfirmation =
        state.context.data?.positionsForConfirmation;
      // arrange the wordsForConfirmation in the wrong order as the mnemonic determined by positionsForConfirmation
      const wordsForConfirmationInOrder =
        positionsForConfirmation?.map((position) => words?.[position]) || [];
      service.send('CONFIRM_MNEMONIC', {
        data: { words: wordsForConfirmationInOrder },
      });
      await expectStateMatch(service, 'waitingMnemonic.mnemonicNotMatch');
    });

    it('should be able to confirm mnemonic', async () => {
      await expectStateMatch(service, 'waitingMnemonic');
      state = service.getSnapshot();
      const words = state.context.data?.mnemonic;
      const positionsForConfirmation =
        state.context.data?.positionsForConfirmation;
      // arrange the wordsForConfirmation in the same order as the mnemonic determined by positionsForConfirmation
      const wordsForConfirmationInOrder =
        positionsForConfirmation?.map((position) => words?.[position - 1]) ||
        [];
      service.send('CONFIRM_MNEMONIC', {
        data: { words: wordsForConfirmationInOrder },
      });
      await expectStateMatch(service, 'waitingMnemonic.validMnemonic');
    });

    it('should create the account after the confirmation', async () => {
      await expectStateMatch(service, 'waitingMnemonic');
      state = service.getSnapshot();
      const words = state.context.data?.mnemonic;
      const positionsForConfirmation =
        state.context.data?.positionsForConfirmation;
      // arrange the wordsForConfirmation in the same order as the mnemonic determined by positionsForConfirmation
      const wordsForConfirmationInOrder =
        positionsForConfirmation?.map((position) => words?.[position - 1]) ||
        [];
      service.send('CONFIRM_MNEMONIC', {
        data: { words: wordsForConfirmationInOrder },
      });
      await expectStateMatch(service, 'waitingMnemonic.validMnemonic');
      service.send('CREATE_MANAGER', { data: { mnemonic: words } });
      await expectStateMatch(service, 'creatingWallet');
      state = service.getSnapshot();
      expect(state.context.account).toBeTruthy();
      await db.clear();
      await Storage.clear();
    });
  });

  describe('type: recover', () => {
    it('should be able to recover wallet using seed phrase', async () => {
      await db.clear();
      await Storage.clear();
      const machine = signUpMachine.withContext({
        type: SignUpType.recover,
      });
      const service = interpret(machine).start();

      await expectStateMatch(service, 'recoveringWallet.addingPassword');
      const password = 'Password@1';
      await expectStateMatch(service, 'recoveringWallet.addingPassword');
      service.send('CREATE_PASSWORD', { data: { password } });
      const words = Mnemonic.generate(MNEMONIC_SIZE).split(' ');

      service.send('CONFIRM_MNEMONIC', { data: { words } });
      await expectStateMatch(
        service,
        'recoveringWallet.enteringMnemonic.validMnemonic'
      );
      service.send('NEXT');
      await expectStateMatch(service, 'done');
      state = service.getSnapshot();
      expect(state.context.account).toBeTruthy();
    });
  });
});
