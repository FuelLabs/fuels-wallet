/// <reference types="cypress" />
import '@this-dot/cypress-indexeddb';

Cypress.Commands.add('getByAriaLabel', (selector, options) => {
  return cy.get(`[aria-label="${selector}"]`, options);
});
