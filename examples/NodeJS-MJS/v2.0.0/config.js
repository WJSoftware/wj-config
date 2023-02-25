import wjConfig, { Environment } from 'wj-config';
import mainConfig from "./config.json" assert {type: 'json'};
import loadFile from './load-file.js';
import envTraits from './env-traits.js';

const env = new Environment({
    name: process.env.NODE_ENV,
    traits: parseInt(process.env.ENV_TRAITS)
});

const config = wjConfig()
    .addObject(mainConfig)
    .name('Main')
    .includeEnvironment(env)
    .addPerEnvironment((b, e) => b.addJson(() => loadFile(`./config.${e}.json`)))
    .addJson(() => loadFile('config.nonTTY.json'))
    .when(e => !process.stdout.isTTY)
    .addJson(() => loadFile('config.Amiga.json'))
    .whenAllTraits(envTraits.Amiga, 'Amiga Preference')
    .addJson(() => loadFile('config.Apple.json'))
    .whenAllTraits(envTraits.Apple, 'Apple Preference')
    .addEnvironment(process.env)
    .createUrlFunctions()
    .build(env.isPreProduction());

export default await config;
