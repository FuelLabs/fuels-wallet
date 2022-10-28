import type { Application } from '@fuels-wallet/types';

import { ApplicationService } from './application';

const MOCK_APP: Application = {
  origin: 'foo.com',
  accounts: ['fuel0x2c8e117bcfba11c76d7db2d43464b1d2093474ef'],
};
const MOCK_APP_2: Application = {
  origin: 'foo.bar.com',
  accounts: ['fuel0x2c8e117bcfba11c76d7db2d43464b1d2093474ef'],
};

describe('AccountService', () => {
  beforeEach(async () => {
    await ApplicationService.clearApplications();
  });

  it('should add a new application', async () => {
    const apps = await ApplicationService.getApplications();
    expect(apps.length).toBe(0);
    await ApplicationService.addApplication({ data: MOCK_APP });
    expect((await ApplicationService.getApplications()).length).toBe(1);
  });

  it('should not add two apps with same origin', async () => {
    await ApplicationService.addApplication({ data: MOCK_APP });
    expect(async () => {
      await ApplicationService.addApplication({ data: MOCK_APP });
    }).rejects.toThrow();
    expect((await ApplicationService.getApplications()).length).toBe(1);
  });

  it('should not add two apps with same origin', async () => {
    await ApplicationService.addApplication({ data: MOCK_APP });
    expect(async () => {
      await ApplicationService.addApplication({ data: MOCK_APP });
    }).rejects.toThrow();
    expect((await ApplicationService.getApplications()).length).toBe(1);
  });

  it('should list all apps', async () => {
    await ApplicationService.addApplication({ data: MOCK_APP });
    await ApplicationService.addApplication({ data: MOCK_APP_2 });
    const apps = await ApplicationService.getApplications();
    expect(apps.length).toBe(2);
  });

  it('should get app by origin', async () => {
    await ApplicationService.addApplication({ data: MOCK_APP });
    await ApplicationService.addApplication({ data: MOCK_APP_2 });
    const app = await ApplicationService.getApplication(MOCK_APP.origin);
    expect(app?.origin).toEqual(MOCK_APP.origin);
    expect(app?.accounts).toEqual(MOCK_APP.accounts);
    const app2 = await ApplicationService.getApplication(MOCK_APP_2.origin);
    expect(app2?.origin).toEqual(MOCK_APP_2.origin);
    expect(app2?.accounts).toEqual(MOCK_APP_2.accounts);
  });

  it('should remove app', async () => {
    await ApplicationService.addApplication({ data: MOCK_APP });
    await ApplicationService.addApplication({ data: MOCK_APP_2 });
    expect((await ApplicationService.getApplications()).length).toBe(2);
    await ApplicationService.removeApplication(MOCK_APP.origin);
    const app = await ApplicationService.getApplication(MOCK_APP.origin);
    expect(app).toBeFalsy();
    expect((await ApplicationService.getApplications()).length).toBe(1);
  });
});
