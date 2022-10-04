import { clearMocks, mockAccount } from 'cypress/utils';

import { VITE_FUEL_PROVIDER_URL } from '~/config';

const ITEM_SELECTOR = '[data-testid="fuel_network-item"]';

describe('Networks', () => {
  beforeEach(() => {
    clearMocks();
    mockAccount();
    cy.visit('/networks');
  });

  it('should be able to see network list', () => {
    cy.contains('Local');
    cy.contains('Another');
  });

  it('should be able to update a network', () => {
    cy.visit('/networks/update/1');
    cy.contains(/Update network/i);
    cy.get('input[name="name"]')
      .should('have.focus')
      .should('have.value', 'Local')
      .clear()
      .type('Local 1');
    cy.get('input[name="url"]').should('have.value', VITE_FUEL_PROVIDER_URL);
    cy.contains('button', /update/i)
      .should('be.enabled')
      .click();
    cy.contains('Local 1');
  });

  it('should be able to add a new network', () => {
    cy.getByAriaLabel('Add network').click();
    cy.contains('button', /create/i).should('not.be.enabled');
    cy.get('input').first().should('have.focus').type('Test Network');
    cy.get('input').eq(1).type('https://test.network/graphql');
    cy.contains('button', /create/i)
      .should('be.enabled')
      .click();
  });

  it('should be able to select a network', () => {
    cy.visit('/wallet');
    cy.getByAriaLabel('Selected Network').should('include.text', 'Local');
    cy.visit('/networks');
    cy.contains('Another').click();
    cy.visit('/networks');
    cy.get(ITEM_SELECTOR).eq(1).should('have.attr', 'data-active', 'true');
    cy.visit('/wallet');
    cy.getByAriaLabel('Selected Network').should('include.text', 'Another');
  });

  it('should be able to remove a network', () => {
    cy.get(ITEM_SELECTOR).should('have.length', 2);
    cy.getByAriaLabel('Remove').first().click();
    cy.contains(/Are you absolutely sure/i);
    cy.contains('button', /confirm/i).click();
    cy.get(ITEM_SELECTOR).should('have.length', 1);
    cy.get(ITEM_SELECTOR).first().should('have.attr', 'data-active', 'true');
  });
});
