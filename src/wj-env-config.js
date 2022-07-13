'use strict';
const helpers = require('./helpers');

const isOptionKey = (key, prefix) => key.startsWith(prefix);

const processKey = (key, prefix) => {
    key = key.substring(prefix.length);
    return key.split('__');
};

const ensurePropertyValue = (obj, name) => {
    if (obj[name] === undefined) {
        obj[name] = {};
    }
    return obj[name];
}

const envConfig = (env, prefix) => {
    const result = {};
    if (!env || !helpers.isObject(env)) {
        return result;
    }
    if (typeof prefix !== 'string') {
        throw new Error('The provided prefix value is not a string.');
    }
    if (prefix.length === 0) {
        throw new Error('The provided prefix value is an empty string.');
    }
    helpers.forEachProperty(env, (key, value) => {
        if (isOptionKey(key, prefix)) {
            const keyParts = processKey(key, prefix);
            let obj = result;
            for (let i = 0; i < keyParts.length - 1; ++i) {
                obj = ensurePropertyValue(obj, keyParts[i]);
                if (!helpers.isObject(obj)) {
                    throw new Error(`Cannot set the value of environment variable "${key}" because "${keyParts[i]}" has already been created as a leaf value.`);
                }
            }
            // Ensure there is no value override.
            if (obj[keyParts[keyParts.length - 1]]) {
                throw new Error(`Cannot set the value of environment variable "${key}" because "${keyParts[keyParts.length - 1]}" has already been created as an object to hold other values.`);
            }
            obj[keyParts[keyParts.length - 1]] = helpers.attemptParse(value);
        }
    });
    return result;
};

module.exports = envConfig;
