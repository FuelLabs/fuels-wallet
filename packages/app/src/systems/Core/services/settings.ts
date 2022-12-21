export type SettingsInputs = {
  setBalanceVisibility: {
    visibility: boolean;
  };
};

export class SettingsService {
  static setBalanceVisbility(input: SettingsInputs['setBalanceVisibility']) {
    return localStorage.setItem(
      'balanceVisibility',
      input.visibility.toString()
    );
  }

  static getBalanceVisbility() {
    return localStorage.getItem('balanceVisibility') === 'true';
  }
}
