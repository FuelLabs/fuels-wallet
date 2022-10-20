describe('CreateWallet', () => {
  it('should be redirect to /signup by default', () => {
    cy.visit('/wallet');
    cy.url().should('contain', '/sign-up');
  });

  it('should be able to create wallet and see first account created', () => {
    cy.clearIndexedDb('FuelDB');

    cy.visit('/wallet');
    cy.contains('button', /Create a wallet/i).click();

    /** Write Mnemonic */
    cy.contains('button', /Copy/i).click();
    cy.get('button[role="checkbox"]').click();
    cy.contains('button', /Next/i).click();

    /** Confirm Mnemonic */
    cy.contains(/Write down your Recover Phrase/i);
    cy.contains('button', /Paste/i).click();
    cy.contains('button', /Next/i).click();

    /** Adding password */
    cy.contains(/Create your password/i);
    cy.getByAriaLabel('Your Password').type('12345678');
    cy.getByAriaLabel('Confirm Password').type('12345678');
    cy.get('button[role="checkbox"]').click();
    cy.contains('button', /Next/i).click();

    /** Account created */
    cy.contains(/Wallet created successfully/i);
    cy.contains(/Account 1/i);
    /**
     * Checking private and public routes
     * Need reload() in order to see if will redirect to the right place
     * */
    cy.reload();
    cy.visit('/wallet').contains(/assets/i);
  });
});
