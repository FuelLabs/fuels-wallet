import { Mnemonic, Wallet } from 'fuels';
import { interpret } from 'xstate';

import { signUpMachine } from './signUpMachine';
import type { SignUpMachineService } from './signUpMachine';

import { db } from '~/systems/Core';
import { expectStateMatch } from '~/systems/Core/__tests__';

function createMachine() {
  return signUpMachine.withConfig({
    actions: {
      redirectToWalletCreated: () => {},
      redirectToWelcome: () => {},
    },
  });
}

describe('signUpMachine', () => {
  let service: SignUpMachineService;

  beforeEach(() => {
    service = interpret(createMachine()).start();
  });

  afterEach(() => {
    service.stop();
  });

  describe('Create', () => {
    it('should be able to create a mnemonic', async () => {
      await expectStateMatch(service, 'atWelcome');
      service.send('CREATE');
      await expectStateMatch(service, 'aggrement');
      service.send('NEXT');
      const state = await expectStateMatch(service, 'create.showingMnemonic');
      const menemonic = state.context.data?.mnemonic;
      expect(menemonic).toBeTruthy();
      service.send('NEXT');
      await expectStateMatch(service, 'create.confirmMnemonic');
      service.send('CONFIRM_MNEMONIC', { data: { words: menemonic } });
      await expectStateMatch(service, 'addingPassword');
      service.send('CREATE_MANAGER', { data: { password: 'password' } });
      await expectStateMatch(service, 'creatingWallet');
      await expectStateMatch(service, 'done');
    });

    it('should be able to conitnue create after failing to check mnemonic', async () => {
      await expectStateMatch(service, 'atWelcome');
      service.send('CREATE');
      await expectStateMatch(service, 'aggrement');
      service.send('NEXT');
      const state = await expectStateMatch(service, 'create.showingMnemonic');
      const menemonic = state.context.data?.mnemonic || [];
      expect(menemonic).toBeTruthy();
      service.send('NEXT');
      // Create a wrong mnemonic
      const wrongMenemonic = [...menemonic.slice(1), 'wrong'];
      await expectStateMatch(service, 'create.confirmMnemonic');
      service.send('CONFIRM_MNEMONIC', { data: { words: wrongMenemonic } });
      // Should fail with wrong mnemonic
      const state2 = await expectStateMatch(service, 'create.confirmMnemonic');
      expect(state2.context.error).toBe(
        "The Seed Phrase doesn't match. Check the phrase for typos or missing words"
      );
      // Should pass if we use the correct mnemonic
      service.send('CONFIRM_MNEMONIC', { data: { words: menemonic } });
      // Finish the process ensure error is clear after fixing the mnemonic
      const state3 = await expectStateMatch(service, 'addingPassword');
      expect(state3.context.error).toBeFalsy();
      service.send('CREATE_MANAGER', { data: { password: 'password' } });
      await expectStateMatch(service, 'creatingWallet');
      await expectStateMatch(service, 'done');
    });
  });

  describe('IMPORT', () => {
    it('should be able to import mnemonic', async () => {
      await expectStateMatch(service, 'atWelcome');
      service.send('IMPORT');
      await expectStateMatch(service, 'aggrement');
      service.send('NEXT');
      await expectStateMatch(service, 'import');
      // Import a 24 words mnemonic
      const words = Mnemonic.generate(32).split(' ');
      const wallet = Wallet.fromMnemonic(words.join(' '));
      service.send('IMPORT_MNEMONIC', {
        data: {
          words,
        },
      });
      await expectStateMatch(service, 'addingPassword');
      service.send('CREATE_MANAGER', { data: { password: 'password' } });
      await expectStateMatch(service, 'creatingWallet');
      await expectStateMatch(service, 'done');
      // Verify that account created is the same as the imported mnemonic
      const accounts = await db.accounts.toArray();
      expect(accounts.length).toBe(1);
      expect(accounts[0].address).toEqual(wallet.address.toString());
    });
    it('should be able to conitnue import after failing to check mnemonic', async () => {
      await expectStateMatch(service, 'atWelcome');
      service.send('IMPORT');
      await expectStateMatch(service, 'aggrement');
      service.send('NEXT');
      await expectStateMatch(service, 'import');
      // Import a 24 words mnemonic
      const words = Mnemonic.generate(32).split(' ');
      const wrongWords = [...words.slice(1), 'notValid'];
      const wallet = Wallet.fromMnemonic(words.join(' '));
      // Import invalid mnemonic
      service.send('IMPORT_MNEMONIC', {
        data: {
          words: wrongWords,
        },
      });
      const state = await expectStateMatch(service, 'import');
      expect(state.context.error).toBe(
        'The Seed Phrase is not valid. Check the words for typos or missing words'
      );
      // Import the correct mnemonic
      service.send('IMPORT_MNEMONIC', {
        data: {
          words,
        },
      });
      await expectStateMatch(service, 'addingPassword');
      service.send('CREATE_MANAGER', { data: { password: 'password' } });
      await expectStateMatch(service, 'creatingWallet');
      await expectStateMatch(service, 'done');
      // Verify that account created is the same as the imported mnemonic
      const accounts = await db.accounts.toArray();
      expect(accounts.length).toBe(1);
      expect(accounts[0].address).toEqual(wallet.address.toString());
    });
  });
});
