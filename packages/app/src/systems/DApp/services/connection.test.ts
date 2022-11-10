import type { Connection } from '@fuel-wallet/types';

import { ConnectionService } from './connection';

const MOCK_APP: Connection = {
  origin: 'foo.com',
  accounts: ['fuel0x2c8e117bcfba11c76d7db2d43464b1d2093474ef'],
};
const MOCK_APP_2: Connection = {
  origin: 'foo.bar.com',
  accounts: ['fuel0x2c8e117bcfba11c76d7db2d43464b1d2093474ef'],
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
    await ConnectionService.addConnection({ data: MOCK_APP });
    expect(async () => {
      await ConnectionService.addConnection({ data: MOCK_APP });
    }).rejects.toThrow();
    expect((await ConnectionService.getConnections()).length).toBe(1);
  });

  it('should not add two apps with same origin', async () => {
    await ConnectionService.addConnection({ data: MOCK_APP });
    expect(async () => {
      await ConnectionService.addConnection({ data: MOCK_APP });
    }).rejects.toThrow();
    expect((await ConnectionService.getConnections()).length).toBe(1);
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
    await ConnectionService.removeConnection(MOCK_APP.origin);
    const app = await ConnectionService.getConnection(MOCK_APP.origin);
    expect(app).toBeFalsy();
    expect((await ConnectionService.getConnections()).length).toBe(1);
  });
});
