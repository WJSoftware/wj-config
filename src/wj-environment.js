'use strict';
const helpers = require('./helpers');

function Environment(envValue, envNames) {
    if (new.target === undefined) {
        throw new Error('This is a construction function and must be called with the "new" keyword.');
    }
    if (envNames && (!helpers.isArray(envNames) || envNames.length === 0)) {
        throw new Error('No environment names were provided.');
    }
    this.value = envValue;
    this.names = envNames ?? Environment.defaultEnvNames;
    let currEnvFound = false;
    this.names.forEach((name) => {
        this[`is${name}`] = function () { return this.value === name; };
        currEnvFound = currEnvFound || name === envValue;
    });
    // Throw if the current environment value was not found.
    if (!currEnvFound) {
        throw new Error(`The provided environment value "${envValue}" was not found among the provided list of environments.`);
    }
}

Environment.defaultEnvNames = [
    'Development',
    'PreProduction',
    'Production'
];

module.exports = Environment;
