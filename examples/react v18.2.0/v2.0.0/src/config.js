import wjConfig, { Environment } from 'wj-config';
import mainConfig from './config.json'; // One may import data like this, or fetch it.

const env = new Environment(window.env.REACT_ENVIRONMENT);
const config = wjConfig()
    .addObject(mainConfig)
    .name('Main Configuration')
    .addFetchedConfig(`./config.${env.value}.json`, false)
    .name(`${env.name} Configuration`)
    .addEnvironment(env.isDevelopment() ? process.env : window.env, 'REACT_APP_')
    .includeEnvironment(env)
    .createUrlFunctions()
    .build(env.isDevelopment());

export default await config;
