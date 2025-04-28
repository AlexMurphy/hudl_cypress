const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://www.hudl.com',
    setupNodeEvents(on, config) {
    },
  },
});
