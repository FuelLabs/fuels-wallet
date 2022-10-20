import { clearMocks } from 'cypress/utils';

const WORDS =
  'iron hammer spoon shield ahead long banana foam deposit laundry promote captain';

describe('RecoverWallet', () => {
  beforeEach(() => {
    clearMocks();
  });

  it('should be redirect to /signup by default', () => {
    cy.visit('/wallet');
    cy.url().should('contain', '/sign-up');
  });

  it('should be able to recover a wallet', () => {
    cy.visit('/wallet');
    cy.contains('button', /I already have a wallet/i).click();

    /** Simulating clipboard write */
    cy.get('input').first().focus();
    cy.window().its('navigator.clipboard').invoke('writeText', WORDS);
    cy.document().invoke('execCommand', 'paste');

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
    cy.contains('fuel1r...xqqj');
  });
});
