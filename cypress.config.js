const { defineConfig } = require('cypress');

module.exports = defineConfig({
  fixturesFolder: false,
  viewportWidth: 1512,
  viewportHeight: 982,
  requestTimeout: 10000,
  video: false,

  e2e: {
    baseUrl: 'http://localhost:3000',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
