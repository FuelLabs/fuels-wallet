import { clearMocks, mockAccount } from 'cypress/utils';

describe('Home', () => {
  beforeEach(() => {
    clearMocks();
    mockAccount();
  });

  it('should change balance when select a new network', () => {
    cy.visit('/wallet');
    cy.contains('Faucet').click();
    cy.contains('button', 'Give me ETH').click();
    cy.contains('0,5 ETH');

    /** Select a new network */
    cy.getByAriaLabel('Selected Network').click();
    cy.get('[data-testid="fuel_network-item"]').eq(1).click();

    /** Verify empty balances */
    cy.visit('/wallet');
    cy.contains(/you don't have any assets/i);
  });

  it('should open the side bar and close it', () => {
    cy.visit('/wallet');
    cy.get('[aria-label="drawer_trigger"]').eq(1).click();
    cy.contains('Wallet');
    cy.contains('Support');
    cy.get('[aria-label="drawer_closeButton"]').eq(1).click();
  });
});
