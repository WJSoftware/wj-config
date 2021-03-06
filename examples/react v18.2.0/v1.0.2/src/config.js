import wjConfig from 'wj-config';
// In the browser we cannot load files at will unless we obtain from an HTTP call, but modules do not support async 
// loading, so the easiest is to just load all environment JSON files in different variables.
import mainConfig from './config/config.json';
import devConfig from './config/config.Development.json';
import preProdConfig from './config/config.PreProduction.json';
import prodConfig from './config/config.Production.json';

// We recommend setting REACT_ENVIRONMENT as a property of an env object, that in turn is a property in the window 
// object and not use the .env REACT system at all.  The .env system is like C's macros that disapper once the React 
// app is built.  Read to the end of this Readme to see how this should be done.
const envName = window.env.REACT_ENVIRONMENT;
let envConfig = null;
//Use a simple switch case to obtain the appropriate override config.
switch (envName) {
    case 'Development':
        envConfig = devConfig;
        break;
    case 'PreProduction':
        envConfig = preProdConfig;
        break;
    case 'Production':
        envConfig = prodConfig;
        break;
    default:
        throw new Error(`Unrecognized environment name "${envName}".`);
}
// 2Do:  In the next version of wj-config, replace this with:
// const tmpEnv = new wjConfig.Environment(env, wjConfig.defaults.envNames);
// const env = tmpEnv.isDevelopment() ? process.env : window.env;
const env = envName === 'Development' ? process.env : window.env;
const config = wjConfig([mainConfig, envConfig], envName, {
    env: env,
    envPrefix: 'REACT_APP_'
});
// Go open the browser's console and see how the configuration object ended up looking like.
console.log('Config: %o', config);
export default config;
