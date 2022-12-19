describe('Invalid route handling', () => {
    it('shows the error page when navigating to an invalid route', () => {
      cy.visit('/calendar/sdakdh');
      cy.contains('Error: Page not found');
    });
  });