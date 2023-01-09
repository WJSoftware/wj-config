import wjConfig, { Environment } from 'wj-config';
import mainConfig from "./config.json" assert {type: 'json'};
import loadFile from './load-file.js';
import envTraits from './env-traits.js';

const loadJsonFile = (fileName, isRequired) => {
    const data = loadFile(fileName, isRequired);
    if (data === null) {
        return {};
    }
    return JSON.parse(data);
};

const env = new Environment({
    name: process.env.NODE_ENV,
    traits: parseInt(process.env.ENV_TRAITS)
});

const config = wjConfig()
    .addObject(mainConfig)
    .name('Main Configuration')
    .includeEnvironment(env)
    .addPerEnvironment((b, e) => b.addComputed(() => loadJsonFile(`./config.${e}.json`)))
    .addComputed(() => loadJsonFile('config.nonTTY.json'))
    .when(e => !process.stdout.isTTY)
    .addComputed(() => loadJsonFile('config.Amiga.json'))
    .whenAllTraits(envTraits.Amiga, 'Amiga Preference')
    .addComputed(() => loadJsonFile('config.Apple.json'))
    .whenAllTraits(envTraits.Apple, 'Apple Preference')
    .addEnvironment(process.env)
    .createUrlFunctions()
    .build(env.isPreProduction());

export default await config;
