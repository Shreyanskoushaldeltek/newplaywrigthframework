// cucumber.js
module.exports = {
  default: {
    require: [
      'steps/**/*.ts',
      'support/**/*.ts'
    ],
    requireModule: ['ts-node/register'],
    format: ['progress', 'json:reports/cucumber-report.json'],
    paths: ['features/**/*.feature'],
  },
};