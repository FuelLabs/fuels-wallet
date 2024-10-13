import type { Connection } from '@fuel-wallet/types';
import { MOCK_ACCOUNTS } from '~/systems/Account';

import { error } from 'node:console';
import { ConnectionService } from './connection';

const MOCK_APP: Connection = {
  origin: 'foo.com',
  accounts: [
    '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
  ],
  favIconUrl: 'https://wallet.fuel.network/favicon.ico',
  title: 'Foo',
};
const MOCK_APP_2: Connection = {
  origin: 'foo.bar.com',
  accounts: [
    '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
  ],
  favIconUrl: 'https://wallet.fuel.network/favicon.ico',
  title: 'Foo Bar',
};

describe('ConnectionService', () => {
  beforeEach(async () => {
    await ConnectionService.clearConnections();
  });

  it('should add a new application', async () => {
    const apps = await ConnectionService.getConnections();
    expect(apps.length).toBe(0);
    await ConnectionService.addConnection({ data: MOCK_APP });
    expect((await ConnectionService.getConnections()).length).toBe(1);
  });

  it('should not add two apps with same origin', async () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation();
    await ConnectionService.addConnection({ data: MOCK_APP });
    await expect(async () => {
      await ConnectionService.addConnection({ data: MOCK_APP });
    }).rejects.toThrow();
    expect((await ConnectionService.getConnections()).length).toBe(1);
    errorSpy.mockRestore();
  });

  it('should list all apps', async () => {
    await ConnectionService.addConnection({ data: MOCK_APP });
    await ConnectionService.addConnection({ data: MOCK_APP_2 });
    const apps = await ConnectionService.getConnections();
    expect(apps.length).toBe(2);
  });

  it('should get app by origin', async () => {
    await ConnectionService.addConnection({ data: MOCK_APP });
    await ConnectionService.addConnection({ data: MOCK_APP_2 });
    const app = await ConnectionService.getConnection(MOCK_APP.origin);
    expect(app?.origin).toEqual(MOCK_APP.origin);
    expect(app?.accounts).toEqual(MOCK_APP.accounts);
    const app2 = await ConnectionService.getConnection(MOCK_APP_2.origin);
    expect(app2?.origin).toEqual(MOCK_APP_2.origin);
    expect(app2?.accounts).toEqual(MOCK_APP_2.accounts);
  });

  it('should remove app', async () => {
    await ConnectionService.addConnection({ data: MOCK_APP });
    await ConnectionService.addConnection({ data: MOCK_APP_2 });
    expect((await ConnectionService.getConnections()).length).toBe(2);
    await ConnectionService.removeConnection({ origin: MOCK_APP.origin });
    const app = await ConnectionService.getConnection(MOCK_APP.origin);
    expect(app).toBeFalsy();
    expect((await ConnectionService.getConnections()).length).toBe(1);
  });

  it('should add an account to connection', async () => {
    await ConnectionService.addConnection({ data: MOCK_APP });
    await ConnectionService.addAccountTo({
      origin: MOCK_APP.origin,
      account: MOCK_ACCOUNTS[2].address,
    });
    const app = await ConnectionService.getConnection(MOCK_APP.origin);
    expect(app?.accounts.length).toBe(2);
  });

  it('should remove an account from connection', async () => {
    await ConnectionService.addConnection({ data: MOCK_APP });
    await ConnectionService.removeAccountFrom({
      origin: MOCK_APP.origin,
      account: MOCK_APP.accounts[0],
    });
    const app = await ConnectionService.getConnection(MOCK_APP.origin);
    expect(app?.accounts.length).toBe(0);
  });
});
