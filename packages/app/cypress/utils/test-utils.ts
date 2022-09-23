import { Wallet } from 'fuels';

import { IS_LOGGED_KEY } from '~/config';
import type { Account } from '~/systems/Account';

export const clearMocks = () => {
  localStorage.removeItem(IS_LOGGED_KEY);
  cy.clearIndexedDb('FuelDB');
};

export const mockAccount = (account?: Account) => {
  // needs to set version 8 to openIndexedDb, to match version 10 of application.
  localStorage.setItem(IS_LOGGED_KEY, 'true');
  cy.openIndexedDb('FuelDB', 8).as('db');

  const wallet = Wallet.generate();
  const accountData = account || {
    address: wallet.address.toAddress(),
    name: 'Random Account',
    publicKey: wallet.publicKey,
  };

  cy.getIndexedDb('@db').createObjectStore('accounts').createItem(accountData.address, accountData);
  cy.getIndexedDb('@db').createObjectStore('vaults');

  return accountData;
};
