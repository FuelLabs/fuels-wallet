import type { InterpreterFrom } from 'xstate';
import { interpret } from 'xstate';
import { waitFor } from 'xstate/lib/waitFor';

import { settingsMachine } from './settingsMachine';

import { AccountService, MOCK_ACCOUNTS } from '~/systems/Account';

const WORDS = [
  'strange',
  'purple',
  'adamant',
  'crayons',
  'entice',
  'fun',
  'eloquent',
  'missiles',
  'milk',
  'ice',
  'cream',
  'apple',
];

describe('settingsMachine', () => {
  let service: InterpreterFrom<typeof settingsMachine>;

  beforeAll(async () => {
    jest
      .spyOn(AccountService, 'exportVault')
      .mockResolvedValue(WORDS.join(' '));
  });

  beforeEach(async () => {
    service = interpret(settingsMachine).start();
  });

  it('should get mnemonic phrase', async () => {
    service.send('UNLOCK_WALLET', {
      input: {
        account: MOCK_ACCOUNTS[0],
        password: '123123',
      },
    });

    await waitFor(service, (state) => state.matches('gettingMnemonic'));

    const { matches } = await waitFor(service, (state) =>
      state.matches('done')
    );

    const { event } = service.getSnapshot();

    expect(event.data?.length).toBeGreaterThan(1);
    expect(matches('done')).toBeTruthy();
  });
});
