import wjConfig, { Environment } from 'wj-config';
import { Config } from './config-def';
import mainConfig from './config.json';
import envTraits from './env-traits.js';

const env = new Environment((window as any).env.APP_ENV, [
    'Development',
    'Test',
    'PreProduction',
    'Production'
]);

const config = await wjConfig()
    .addObject(mainConfig)
    .name('Main')
    .includeEnvironment(env)
    .addPerEnvironment((b, envName) => !!b.addFetched(`/config.${envName}.json`, false))
    .addFetched('/config.verbose.json', false)
    .name('Verbose')
    .whenAnyTrait(envTraits.VerboseLogging)
    .addFetched('/config.BasicCustomer.json')
    .name('Basic Customer')
    .addFetched('/config.PremiumCustomer.json')
    .name('Premium Customer')
    // Ensure preimium customer configuration only applies in production environments.
    .whenAllTraits(envTraits.PremiumCustomer | envTraits.Production)
    .createUrlFunctions("api")
    .build(true);

console.log('Config: %o', config);
export default (config as unknown as Config);
