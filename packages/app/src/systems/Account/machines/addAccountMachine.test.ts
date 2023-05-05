// import { interpret } from 'xstate';

// import { AccountService } from '../services';

// import type { AddAccountMachineService } from './addAccountMachine';
// import { addAccountMachine } from './addAccountMachine';

// import { expectStateMatch, mockVault } from '~/systems/Core/__tests__/utils';

// const machine = addAccountMachine.withContext({}).withConfig({
//   actions: {
//     notifyUpdateAccounts() {},
//   },
// });

// const name = 'Account Go';

// describe('addAccountMachine', () => {
//   let service: AddAccountMachineService;

//   beforeEach(async () => {
//     await mockVault();
//     service = interpret(machine).start();
//   });

//   afterEach(() => {
//     service.stop();
//   });

//   describe('add', () => {
//     it('should be able to add an account', async () => {
//       await expectStateMatch(service, 'idle');
//       service.send('ADD_ACCOUNT', {
//         input: name,
//       });

//       await expectStateMatch(service, 'addingAccount');
//       await expectStateMatch(service, 'idle');

//       const accounts = await AccountService.getAccounts();
//       expect(accounts?.[1].name).toBe(name);
//     });

//     it('should not be able to add accounts with same name', async () => {
//       await expectStateMatch(service, 'idle');
//       service.send('ADD_ACCOUNT', {
//         input: name,
//       });
//       await expectStateMatch(service, 'addingAccount');
//       await expectStateMatch(service, 'idle');
//       service.send('ADD_ACCOUNT', {
//         input: name,
//       });

//       // make sure test fails but jest don't stop
//       jest.spyOn(console, 'error').mockImplementation();

//       await expectStateMatch(service, 'failed');
//     });
//   });
// });
