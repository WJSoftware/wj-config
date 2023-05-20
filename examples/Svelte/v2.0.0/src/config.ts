import wjConfig, { Environment, EnvironmentDefinition } from 'wj-config';
import type { Config } from './config-def';
import mainConfig from './config.json';
import envTraits from './env-traits.js';

const { APP_ENV: currEnv, ENV_TRAITS: currTraits } = (globalThis.window as any).env;
const envDef = new EnvironmentDefinition(currEnv, currTraits);
const env = new Environment(envDef, [
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
    .addFetched('/config.FlagPedia.json')
    .name('FlagPedia.net')
    .whenAllTraits(envTraits.FlagPedia)
    .createUrlFunctions("api")
    .build(true);

console.log('Config: %o', config);
export default (config as unknown as Config);
