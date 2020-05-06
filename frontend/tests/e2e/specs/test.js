const url = 'http://localhost:8080';

describe('When not logged in', function () {
  describe('and visiting url paths', function () {
    it('front page redirects to /login', function () {
      cy.visit(url);
      cy.contains('Login');
    });

    it('login page can be opened', function () {
      cy.visit(`${url}/login`);
      cy.contains('Login');
    });

    it('register page can be opened', function () {
      cy.visit(`${url}/register`);
      cy.contains('Register');
    });
  });

  describe('and navigating the website without being logged in', function () {
    beforeEach(function () {
      cy.visit(url);
    });

    it('register page can be opened', function () {
      cy.contains('Register')
        .click();
      cy.get('[data-cy=registerform]').should('be.visible');
    });

    it('login page can be opened', function () {
      cy.contains('Register')
        .click();
      cy.get('[data-cy=registerform]').should('be.visible');
      cy.contains('Login')
        .click();
      cy.get('[data-cy=loginform]').should('be.visible');
    });
  });
});

describe('When trying to log in', function () {
  beforeEach(function () {
    cy.request('POST', `${url}/api/tests/reset`);
    cy.request('POST', `${url}/api/tests/addtestuser`);
    cy.visit(`${url}/login`);
  });

  describe('with correct username and password', function () {
    it('user has successfully logged in', function () {
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

  describe('and user does not exist', function () {
    it('cannot log in', function () {
      cy.get('[data-cy=username]')
        .type('non-existing user');
      cy.get('[data-cy=password]')
        .type('somepass');
      cy.get('[data-cy=loginbutton]')
        .click();
      cy.contains('User does not exist').should('be.visible');
    });
  });

  describe('with an incorrect password', function () {
    it('cannot log in', function () {
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

describe('When logged in', function () {
  const emojiList =
    ['😂 ', '😃 ', '😞 ', '😕 ', '😠 ', '😊 ', '😉 ', '✌', '☝', '👌', '👍'];

  beforeEach(function () {
    cy.request('POST', `${url}/api/tests/reset`);
    cy.request('POST', `${url}/api/tests/addtestuser`);
    cy.visit(`${url}`);
    cy.get('[data-cy=username]')
      .type('root');
    cy.get('[data-cy=password]')
      .type('secret');
    cy.get('[data-cy=loginbutton]')
      .click();
    cy.get('[data-cy=chatpage]').should('be.visible');
  });

  describe('and user types a message', function () {
    it('it can be sent successfully', function () {
      cy.get('[data-cy=chatmessageinput]')
        .type('a message').type('{enter}');
      cy.contains('You:').should('be.visible');
      cy.contains('a message').should('be.visible');
    });

    it('certain patterns are converted to emojis', function () {
      cy.get('[data-cy=chatmessageinput]')
        .type(':DD ').type('{enter}');
      cy.contains(emojiList[0]).should('be.visible');

      cy.get('[data-cy=chatmessageinput]')
        .type(':D ').type('{enter}');
      cy.contains(emojiList[1]).should('be.visible');

      cy.get('[data-cy=chatmessageinput]')
        .type(':( ').type('{enter}');
      cy.contains(emojiList[2]).should('be.visible');

      cy.get('[data-cy=chatmessageinput]')
        .type(':/ ').type('{enter}');
      cy.contains(emojiList[3]).should('be.visible');

      cy.get('[data-cy=chatmessageinput]')
        .type('>:( ').type('{enter}');
      cy.contains(emojiList[4]).should('be.visible');

      cy.get('[data-cy=chatmessageinput]')
        .type(':) ').type('{enter}');
      cy.contains(emojiList[5]).should('be.visible');

      cy.get('[data-cy=chatmessageinput]')
        .type(';) ').type('{enter}');
      cy.contains(emojiList[6]).should('be.visible');

      cy.get('[data-cy=chatmessageinput]')
        .type(':victory_hand:').type('{enter}');
      cy.contains(emojiList[7]).should('be.visible');

      cy.get('[data-cy=chatmessageinput]')
        .type(':pointing_hand:').type('{enter}');
      cy.contains(emojiList[8]).should('be.visible');

      cy.get('[data-cy=chatmessageinput]')
        .type(':ok_hand:').type('{enter}');
      cy.contains(emojiList[9]).should('be.visible');

      cy.get('[data-cy=chatmessageinput]')
        .type(':thumbs_up:').type('{enter}');
      cy.contains(emojiList[10]).should('be.visible');
    });
  });

  describe('and \'User list\'-button is pressed', function () {
    it('a user list is shown', function () {
      cy.get('[data-cy="userlistbtn"]')
        .click();
      cy.get('[data-cy="userlist"]').should('be.visible');
      cy.contains('root').should('be.visible');
    });
  });

  describe('and user hovers to the emoji picker button', function () {
    it('it shows emoji buttons', function () {
      cy.get('[data-cy="emojipickerbtn"]')
        .trigger('mouseenter');
      cy.get('[data-cy="emojipicker"]').should('be.visible');

      emojiList.forEach((e) => {
        cy.contains(e);
      });
    });

    it('user can pick emojis for message', function () {
      cy.get('[data-cy="emojipickerbtn"]')
        .trigger('mouseenter');
      cy.get('[data-cy="emojipicker"]').should('be.visible');

      cy.contains(emojiList[0]).click();
      cy.get('[data-cy=chatmessageinput]')
        .type('{enter}');
      cy.contains('You:').should('be.visible');
      cy.contains(emojiList[0]).should('be.visible');
    });
  });
});

