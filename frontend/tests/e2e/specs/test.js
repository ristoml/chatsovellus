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

describe('When trying to register', function () {
  beforeEach(function () {
    cy.request('POST', `${url}/api/tests/reset`);
    cy.visit(`${url}`);
    cy.contains('Register')
      .click();
    cy.get('[data-cy=registerform]').should('be.visible');
  });

  describe('with proper username, full name and password', function () {
    it('successfully registered and redirected to /login', function () {
      cy.get('[data-cy=yournamefield]')
        .type('matti virtanen');
      cy.get('[data-cy=usernamefield]')
        .type('mattiv');
      cy.get('[data-cy=passwordfield]')
        .type('gueruigh#4744');
      cy.get('[data-cy=registerbutton]')
        .click();
      cy.get('[data-cy=loginform]').should('be.visible');
    });
  });

  describe('with a username less than 5 characters long', function () {
    it('registration fails', function () {
      cy.get('[data-cy=yournamefield]')
        .type('matti virtanen');
      cy.get('[data-cy=usernamefield]')
        .type('matt');
      cy.get('[data-cy=passwordfield]')
        .type('gueruigh#4744');
      cy.get('[data-cy=registerbutton]')
        .click();
      cy.contains('Username should be at least 5 characters long.').should('be.visible');
      cy.get('[data-cy=loginform]').should('not.be.visible');
    });
  });

  describe('with a password less than 8 characters long', function () {
    it('registration fails', function () {
      cy.get('[data-cy=yournamefield]')
        .type('matti virtanen');
      cy.get('[data-cy=usernamefield]')
        .type('matti');
      cy.get('[data-cy=passwordfield]')
        .type('123456a');
      cy.get('[data-cy=registerbutton]')
        .click();
      cy.contains('Password length should be at least 8 characters long.').should('be.visible');
      cy.get('[data-cy=loginform]').should('not.be.visible');
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
  const emojiList = [
    ['😂 ', ':DD '],
    ['😃 ', ':D ' ],
    ['😞 ', ':( ' ],
    ['😕 ', ':/ ' ],
    ['😠 ', '>:( '],
    ['😊 ', ':) ' ],
    ['😉 ', ';) ' ],
    ['✌',   ':victory_hand:' ],
    ['☝',   ':pointing_hand:'],
    ['👌',  ':ok_hand:'      ],
    ['👍',  ':thumbs_up:'    ]
  ];

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
      emojiList.forEach(([emoji, pattern]) => {
        cy.get('[data-cy=chatmessageinput]')
          .type(pattern).type('{enter}');
        cy.contains(emoji).should('be.visible');
      });
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

      emojiList.forEach(([emoji, _]) => {
        cy.contains(emoji);
      });
    });

    it('user can pick emojis for message', function () {
      emojiList.forEach(([emoji, _]) => {
        cy.get('[data-cy="emojipickerbtn"]')
          .trigger('mouseenter');
        cy.get('[data-cy="emojipicker"]').should('be.visible');

        cy.contains(emoji).click();
        cy.get('[data-cy=chatmessageinput]')
          .type('{enter}');

        cy.get('[data-cy="emojipicker"]').should('not.be.visible');

        cy.contains('You:').should('be.visible');
        cy.contains(emoji).should('be.visible');
      });
    });
  });

  describe('and user logs out and logs in again', function () {
    it('previously written message is loaded from the database', function () {
      cy.get('[data-cy=chatmessageinput]')
        .type('a message').type('{enter}');
      cy.contains('You:').should('be.visible');
      cy.contains('a message').should('be.visible');

      cy.get('[data-cy=logoutbutton]')
        .click();
      cy.get('[data-cy=loginform]').should('be.visible');

      cy.get('[data-cy=username]')
        .type('root');
      cy.get('[data-cy=password]')
        .type('secret');
      cy.get('[data-cy=loginbutton]')
        .click();
      cy.get('[data-cy=chatpage]').should('be.visible');

      cy.contains('root:').should('be.visible');
      cy.contains('a message').should('be.visible');
    });
  });
});

