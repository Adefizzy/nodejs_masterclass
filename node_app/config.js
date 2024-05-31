const environment = {};

environment.staging = {
  httpPort: 4000,
  httpsPort: 4001,
  envName: "staging",
};

environment.production = {
  httpPort: 5000,
  httpsPort: 5001,
  envName: "production",
};

const currentEnvironment = Object.keys(environment).includes(
  process.env.NODE_ENV
)
  ? environment[process.env.NODE_ENV]
  : environment.staging;

module.exports = currentEnvironment;
