
const url = 'http://localhost:8080';

describe('When not logged in', function() {
  describe('and visiting url paths', function() {
    it('front page redirects to /login', function() {
      cy.visit(url);
      cy.contains('Login');
    });

    it('login page can be opened', function() {
      cy.visit(`${url}/login`);
      cy.contains('Login');
    });

    it('register page can be opened', function() {
      cy.visit(`${url}/register`);
      cy.contains('Register');
    });
  });

  describe('and navigating the website without being logged in', function() {
    beforeEach(function() {
      cy.visit(url);
    });

    it('register page can be opened', function() {
      cy.contains('Register')
        .click();

      cy.contains('Your name').should('be.visible');
    });
  });
});

describe('When trying to log in', function() {
  beforeEach(function() {
    cy.request('POST', `${url}/api/tests/reset`);
    cy.request('POST', `${url}/api/tests/addtestuser`);
    cy.visit(`${url}/login`);
  });

  describe('with correct username and password', function() {
    it('user has successfully logged in', function() {
      cy.get('[data-cy=username]')
        .type('root');
      cy.get('[data-cy=password]')
        .type('secret');
      cy.get('[data-cy=loginbutton]')
        .click();
      cy.contains('User list');
      cy.contains('Sign out');
    });
  });

  describe('and user does not exist', function() {
    it('cannot log in', function() {
      cy.get('[data-cy=username]')
        .type('non-existing user');
      cy.get('[data-cy=password]')
        .type('somepass');
      cy.get('[data-cy=loginbutton]')
        .click();
      cy.contains('User does not exist').should('be.visible');
    });
  });

  describe('with an incorrect password', function() {
    it('cannot log in', function() {
      cy.get('[data-cy=username]')
        .type('root');
      cy.get('[data-cy=password]')
        .type('wronpass');
      cy.get('[data-cy=loginbutton]')
        .click();
      cy.contains('Incorrect password').should('be.visible');
    });
  });
});

