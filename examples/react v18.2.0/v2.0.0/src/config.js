import wjConfig, { Environment } from 'wj-config';
import mainConfig from './config.json'; // One may import data like this, or fetch it.
import envTraits from './env-traits.js';

const env = new Environment({
    name: window.env.REACT_ENVIRONMENT,
    traits: window.env.REACT_ENV_TRAITS
}, [
    'Development',
    'Test',
    'PreProduction',
    'Production'
]);
const config = wjConfig()
    .addObject(mainConfig)
    .name('Main')
    .includeEnvironment(env)
    .addPerEnvironment((b, envName) => b.addFetched(`/config.${envName}.json`, false))
    .addFetched('/config.verbose.json', false)
    .name('Verbose')
    .whenAnyTrait(envTraits.VerboseLogging)
    .addFetched('/config.BasicCustomer.json')
    .name('Basic Customer')
    .addFetched('/config.PremiumCustomer.json')
    .name('Premium Customer')
    // Ensure preimium customer configuration only applies in production environments.
    .whenAllTraits(envTraits.PremiumCustomer | envTraits.Production)
    .addEnvironment(window.env, 'REACT_APP_')
    .createUrlFunctions("api")
    .build(true);

export default await config;

console.log('Config: %o', config);
