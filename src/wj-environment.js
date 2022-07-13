'use strict';
const helpers = require('./helpers');

const environment = (envValue, envNames) => {
    const env = {
        value: envValue,
        names: envNames
    };
    if (!envNames || !helpers.isArray(envNames) || envNames.length === 0) {
        throw new Error('No environment names were provided.');
    }
    let currEnvFound = false;
    envNames.forEach((name) => {
        env[`is${name}`] = function () { return this.value === name; };
        currEnvFound = currEnvFound || name === envValue;
    });
    // Throw if the current environment value was not found.
    if (!currEnvFound) {
        throw new Error(`The provided environment value "${envValue}" was not found among the provided list of environments.`);
    }
    return env;
};

module.exports = environment;
