const environment = {};

environment.staging = {
  port: 3000,
  envName: "staging",
};

environment.production = {
  port: 5000,
  envName: "production",
};

const currentEnvironment =
  environment[process.env.NODE_ENV] ?? environment.staging;

module.exports = currentEnvironment;
