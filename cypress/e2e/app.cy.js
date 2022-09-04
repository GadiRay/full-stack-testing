describe('bitcoin app', () => {
  it('should visit the home page', () => {
    cy.visit('/');
    cy.contains('Bitcoin App');
  });
  it('should create user and see user details', () => {
    cy.intercept({
      method: 'POST',
      path: /\/api\/v1\/users/,
    }).as('createUser');

    cy.intercept({
      method: 'GET',
      path: /\/api\/v1\/users\/.*/,
    }).as('getUser');

    cy.visit('/');
    cy.get('[aria-label="first-name"]').type('Gadi');
    cy.get('[aria-label="last-name"]').type('Raymond');
    cy.get('[aria-label="email"]').type('gadi@wix.com');
    cy.get('[aria-label="submit"]').click();

    cy.wait('@createUser');
    cy.wait('@getUser').then((interception) => {
      cy.get('[aria-label="show-details"]').click();

      cy.contains('Hello Gadi Raymond');
      cy.contains('Your email is gadi@wix.com');
      cy.contains(`Your have ${interception.response?.body.bitcoins} bitcoins`);
    });
  });
});
