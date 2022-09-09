/// <reference types="cypress" />

Cypress.Commands.add('getByAriaLabel', (selector, options) => {
  return cy.get(`[aria-label="${selector}"]`, options);
});

Cypress.Commands.add('clearIndexedDB', async () => {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.deleteDatabase('FuelDB');
    request.addEventListener('success', () => resolve());
    request.addEventListener('blocked', () => resolve());
    request.addEventListener('error', reject);
  });
});
