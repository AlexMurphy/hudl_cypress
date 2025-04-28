// Selectors organized by functional area
const SELECTORS = {
  navigation: {
    loginButton: '[data-qa-id="login-select"]',
    hudlLoginLink: '[data-qa-id="login-hudl"]',
    subNavMenu: '.mainnav__sub > .subnav__inner > .subnav__group > .subnav__items',
  },
  loginForm: {
    continueButton: '[data-action-button-primary="true"]',
    emailError: '#error-element-username',
    emailField: '#username',
    emailLabel: '[data-dynamic-label-for="username"]',
    errorIcon: '.ulp-input-error-icon',
    passwordError: '#error-element-password',
    passwordField: '#password',
  },
  dashboard: '#koMain',
};

// Test data
const TEST_DATA = {
  credentials: {
    validEmail: Cypress.env('EMAIL_ADDRESS'),
    validPassword: Cypress.env('PASSWORD'),
  },
  invalidInputs: {
    invalidEmail: 'unregistered_email_address',
    validUnregisteredEmail: 'valid_unregistered_email_address@gmail.com',
    genericEmail: 'valid_email_address@gmail.com',
    invalidPassword: 'invalid_password',
  },
};

// Enhanced custom commands
Cypress.Commands.add('openLoginSubNav', () => {
  cy.get(SELECTORS.navigation.loginButton).click();
});

Cypress.Commands.add('navigateToLoginPage', () => {
  cy.openLoginSubNav();
  cy.get(SELECTORS.navigation.hudlLoginLink).click();
});

/**
 * Submit email in the login form
 * @param {string} email - Email to submit
 */
Cypress.Commands.add('submitEmail', (email) => {
  cy.origin(
    'https://identity.hudl.com',
    { args: { email, selectors: SELECTORS.loginForm } },
    ({ email, selectors }) => {
      cy.get(selectors.emailField).type(email);
      cy.window().then((w) => (w.beforeReload = true));
      cy.window().should('have.prop', 'beforeReload', true);
      cy.get(selectors.continueButton).click();
      cy.window().should('not.have.prop', 'beforeReload');
    }
  );
});

/**
 * Submit password in the login form
 * @param {string} password - Password to submit
 */
Cypress.Commands.add('submitPassword', (password) => {
  cy.origin(
    'https://identity.hudl.com',
    { args: { password, selectors: SELECTORS.loginForm } },
    ({ password, selectors }) => {
      cy.get(selectors.passwordField).type(password);
      cy.get(selectors.continueButton).click();
    }
  );
});

/**
 * Login with provided credentials
 * @param {string} email - Login email
 * @param {string} password - Login password
 */
Cypress.Commands.add('login', (email, password) => {
  cy.origin('https://identity.hudl.com', () => {
    cy.visit(
      'https://identity.hudl.com/u/login/identifier?state=hKFo2SBuQ25Dc1I4NEVtdFctcVhoMWdwb0lhZG95MWszLWpmOKFur3VuaXZlcnNhbC1sb2dpbqN0aWTZIGljaFV1YWJiMzZuSXVUMTIxLW82c2tPaVVPYUpRVkYzo2NpZNkgbjEzUmZrSHpLb3phTnhXQzVkWlFvYmVXR2Y0V2pTbjU'
    );
  });
  cy.submitEmail(email);
  cy.submitPassword(password);
});

describe('Hudl Login Flow', () => {
  // Combined navigation tests with device configuration
  const viewportConfigs = [
    { name: 'Desktop', width: 1280, height: 800 },
    { name: 'Mobile', width: 375, height: 812 },
  ];

  viewportConfigs.forEach((viewport) => {
    describe(
      `Navigation to Login Page - ${viewport.name}`,
      {
        viewportWidth: viewport.width,
        viewportHeight: viewport.height,
      },
      () => {
        beforeEach(() => {
          cy.visit('/');
        });

        it('should display the login sub nav when clicking the login button', () => {
          cy.openLoginSubNav();
          cy.get(SELECTORS.navigation.subNavMenu).should('be.visible');
        });

        it('should display the Hudl login link in the sub nav', () => {
          cy.openLoginSubNav();
          cy.get(SELECTORS.navigation.hudlLoginLink).should('be.visible');
        });

        it('should navigate to the login page when clicking the Hudl login link', () => {
          cy.navigateToLoginPage();
          cy.origin('https://identity.hudl.com', { args: { SELECTORS } }, ({ SELECTORS }) => {
            cy.url().should('include', '/login');
            cy.get('h1').should('have.text', 'Log In');
          });
        });
      }
    );
  });

  // Login page verification and error handling tests
  describe('Login Page', () => {
    beforeEach(() => {
      cy.origin('https://identity.hudl.com', () => {
        cy.visit(
          'https://identity.hudl.com/u/login/identifier?state=hKFo2SBuQ25Dc1I4NEVtdFctcVhoMWdwb0lhZG95MWszLWpmOKFur3VuaXZlcnNhbC1sb2dpbqN0aWTZIGljaFV1YWJiMzZuSXVUMTIxLW82c2tPaVVPYUpRVkYzo2NpZNkgbjEzUmZrSHpLb3phTnhXQzVkWlFvYmVXR2Y0V2pTbjU'
        );
      });
    });

    it('should have an email field with proper label', () => {
      cy.origin('https://identity.hudl.com', { args: { selectors: SELECTORS.loginForm } }, ({ selectors }) => {
        cy.get(selectors.emailField).should('be.visible').should('be.enabled');
        cy.get(selectors.emailLabel).should('contain.text', 'Email*');
      });
    });

    it('should have a continue button', () => {
      cy.origin('https://identity.hudl.com', { args: { selectors: SELECTORS.loginForm } }, ({ selectors }) => {
        cy.get(selectors.continueButton).should('be.visible');
      });
    });

    it('should validate required email field', () => {
      cy.origin('https://identity.hudl.com', () => {
        cy.get('input:invalid')
          .should('have.length', 1)
          .invoke('prop', 'validationMessage')
          .should('equal', 'Please fill out this field.');

        cy.get('input:invalid').should('have.length', 1).invoke('prop', 'validity').should('deep.include', {
          valueMissing: true,
          valid: false,
        });
      });
    });

    it('should show error for invalid email format', () => {
      cy.origin(
        'https://identity.hudl.com',
        { args: { selectors: SELECTORS.loginForm, invalidEmail: TEST_DATA.invalidInputs.invalidEmail } },
        ({ selectors, invalidEmail }) => {
          cy.get(selectors.emailField).type(invalidEmail);
          cy.get(selectors.continueButton).click();
          cy.get(selectors.emailError)
            .should('be.visible')
            .should('contain.text', 'Enter a valid email')
            .should('have.css', 'color', 'rgb(232, 28, 0)');
          cy.get(selectors.errorIcon).should('be.visible').should('have.css', 'color', 'rgb(232, 28, 0)');
        }
      );
    });

    it('should display password field after submitting valid email', () => {
      cy.submitEmail(TEST_DATA.invalidInputs.genericEmail);

      cy.origin(
        'https://identity.hudl.com',
        { args: { selectors: SELECTORS.loginForm, email: TEST_DATA.invalidInputs.genericEmail } },
        ({ selectors, email }) => {
          cy.get(selectors.passwordField).should('be.visible');
          cy.get(`[value="${email}"]`).should('have.attr', 'readonly');
        }
      );
    });

    it('should show error for invalid credentials (registered email)', () => {
      cy.submitEmail(TEST_DATA.credentials.validEmail);
      cy.submitPassword(TEST_DATA.invalidInputs.invalidPassword);

      cy.origin('https://identity.hudl.com', { args: { selectors: SELECTORS.loginForm } }, ({ selectors }) => {
        cy.get(selectors.passwordError)
          .should('be.visible')
          .should('have.css', 'color', 'rgb(232, 28, 0)')
          .should('contain.text', 'Your email or password is incorrect. Try again.');

        cy.get(selectors.errorIcon).should('be.visible').should('have.css', 'color', 'rgb(232, 28, 0)');
      });
    });

    it('should show error for invalid credentials (unregistered email)', () => {
      cy.submitEmail(TEST_DATA.invalidInputs.validUnregisteredEmail);
      cy.submitPassword(TEST_DATA.invalidInputs.invalidPassword);

      cy.origin('https://identity.hudl.com', { args: { selectors: SELECTORS.loginForm } }, ({ selectors }) => {
        cy.get(selectors.passwordError)
          .should('be.visible')
          .should('have.css', 'color', 'rgb(232, 28, 0)')
          .should('contain.text', 'Incorrect username or password.');

        cy.get(selectors.errorIcon).should('be.visible').should('have.css', 'color', 'rgb(232, 28, 0)');
      });
    });

    it('should show error for invalid credentials (no password)', () => {
      cy.submitEmail(TEST_DATA.invalidInputs.validUnregisteredEmail);

      cy.origin('https://identity.hudl.com', { args: { selectors: SELECTORS.loginForm } }, ({ selectors }) => {
        cy.get(selectors.continueButton).click();

        cy.get('input:invalid')
          .should('have.length', 1)
          .invoke('prop', 'validationMessage')
          .should('equal', 'Please fill out this field.');

        cy.get('input:invalid').should('have.length', 1).invoke('prop', 'validity').should('deep.include', {
          valueMissing: true,
          valid: false,
        });
      });
    });
  });

  // Successful login test
  describe('Successful Login', () => {
    it('should navigate to dashboard with valid credentials', () => {
      cy.login(TEST_DATA.credentials.validEmail, TEST_DATA.credentials.validPassword);
      cy.get(SELECTORS.dashboard).should('be.visible');
    });
  });
});
