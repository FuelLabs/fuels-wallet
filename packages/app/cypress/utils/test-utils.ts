import type { Account } from '@fuels-wallet/types';
import { Wallet } from 'fuels';

import { IS_LOGGED_KEY, VITE_FUEL_PROVIDER_URL } from '~/config';

export const clearMocks = () => {
  localStorage.removeItem(IS_LOGGED_KEY);
  cy.clearIndexedDb('FuelDB');
};

export const mockAccount = (account?: Account) => {
  // needs to set version 8 to openIndexedDb, to match version 10 of application.
  localStorage.setItem(IS_LOGGED_KEY, 'true');
  cy.openIndexedDb('FuelDB', 17).as('db');

  const wallet = Wallet.generate({
    provider: VITE_FUEL_PROVIDER_URL,
  });
  const accountData = account || {
    address: wallet.address.toAddress(),
    name: 'Random Account',
    publicKey: wallet.publicKey,
  };

  cy.getIndexedDb('@db').createObjectStore('vaults');
  cy.getIndexedDb('@db')
    .createObjectStore('accounts')
    .createItem(accountData.address, accountData);
  cy.getIndexedDb('@db')
    .createObjectStore('networks', { keyPath: 'id' })
    .as('networks')
    .addItem({
      id: '1',
      isSelected: true,
      name: 'Local',
      url: VITE_FUEL_PROVIDER_URL,
    })
    .addItem({
      id: '2',
      isSelected: false,
      name: 'Another',
      url: 'https://another.network.fuel/graphql',
    });

  return accountData;
};
