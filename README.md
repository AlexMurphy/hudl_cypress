# Hudl Cypress Test Automation

This repository contains a Cypress-based test automation framework for testing the Hudl web application. The framework is designed to support end-to-end (E2E) testing, visual regression testing, and custom command extensions.

## Project Structure

```
cypress.config.js
package.json
cypress/
  e2e/
    login.cy.js
  support/
    commands.js
    e2e.js
```

### Key Directories and Files

- **`cypress/e2e/`**: Contains E2E test files. For example, `login.cy.js` tests the login flow.credentials and other test inputs.
- **`cypress/support/`**:
  - `e2e.js`: Configures additional support features, such as visual regression commands.
- **`cypress.config.js`**: Cypress configuration file, including base URL and visual regression setup.
- **`package.json`**: Defines project dependencies and scripts.

## Features

- **End-to-End Testing**: Comprehensive tests for navigation, login, and error handling.
- **Custom Commands**: Enhanced Cypress commands for reusable actions (e.g., `login`, `submitEmail`).
- **Page Object Model (POM)**: Organized selectors and actions for better maintainability.

## Prerequisites

- Node.js (v16 or later)
- npm or yarn

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd hudl_cypress
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

## Usage

### Running Tests

- Run all tests:
  ```bash
  npm run test
  ```

- Run tests in interactive mode:
  ```bash
  npx cypress open
  ```

### Linting and Formatting

- Lint the code:
  ```bash
  npm run lint
  ```

- Fix linting issues:
  ```bash
  npm run lint:fix
  ```

- Format the code:
  ```bash
  npm run prettier
  ```

## Configuration

- **Base URL**: Set in `cypress.config.js` (`https://www.hudl.com`).

## Writing Tests

- Use the Page Object Model for selectors and actions.
- Add custom commands in `commands.js` for reusable logic.
- Follow Cypress best practices: [https://docs.cypress.io](https://docs.cypress.io).

## Dependencies

- `cypress`: End-to-end testing framework.
- `eslint`: Linting tool.
- `prettier`: Code formatter.