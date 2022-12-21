import { SettingsService } from './settings';

describe('SettingsService', () => {
  it('SettingsService visibility set / hidden', async () => {
    SettingsService.setBalanceVisbility({
      visibility: true,
    });
    const visibilityTrue = SettingsService.getBalanceVisbility();
    expect(visibilityTrue).toBe(true);
    SettingsService.setBalanceVisbility({
      visibility: false,
    });
    const visibilityFalse = SettingsService.getBalanceVisbility();
    expect(visibilityFalse).toBe(false);
  });
});
