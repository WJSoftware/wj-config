'use strict';
const helpers = require('./helpers');
const environment = require('./wj-environment');
const merge = require('./merge');
const makeWsUrlFunctions = require('./makeWsUrlFunctions');

const defaultOptions = {
    includeEnv: true,
    env: null,
    envPrefix: 'OPT_',
    envNames: [
        'Development',
        'PreProduction',
        'Production'
    ],
    wsPropertyNames: ['ws']
};

const wjConfig = (envConfigs, env, options) => {
    options = merge(defaultOptions, options);
    const envConfigsIsFn = helpers.isFunction(envConfigs);
    const envConfigsIsArr = helpers.isArray(envConfigs);
    let finalConfig = envConfigsIsFn ? envConfigs() : (envConfigsIsArr ? envConfigs[0] : envConfigs.main);
    let envConfig = envConfigsIsFn ? envConfigs(env) : (envConfigsIsArr ? envConfigs[1] : envConfigs.override);
    finalConfig = merge(finalConfig, envConfig);
    if (options.includeEnv && options.env) {
        envConfig = require('./wj-env-config')(options.env, options.envPrefix);
        finalConfig = merge(finalConfig, envConfig);
    }
    if (options.wsPropertyNames && helpers.isArray(options.wsPropertyNames)) {
        options.wsPropertyNames.forEach(name => makeWsUrlFunctions(finalConfig[name]));
    }
    finalConfig.environment = environment(env, options.envNames);
    return finalConfig;
};

module.exports = wjConfig;
