import { clearMocks, mockAccount } from 'cypress/utils';

describe('FaucetDialog', () => {
  beforeEach(() => {
    clearMocks();
    mockAccount();
  });

  it('should be able to faucet and get redirected to home again with balances', () => {
    /** Checks empty balance */
    cy.visit('/wallet');

    /** Needs to have Faucet button */
    cy.contains('Faucet').click();

    /** Ask to start Faucet */
    cy.contains('button', 'Give me ETH').click();

    /** Checks if Balance in assets list refreshed */
    cy.contains('Ethereum');
    cy.contains('0,5 ETH');

    /** Checks if Balance in BalanceWidget refreshed */
    cy.contains('ETH 0,5');
  });
});
