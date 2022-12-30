import wjConfig, { Environment } from 'wj-config';
import mainConfig from "./config.json" assert {type: 'json'};
import loadFile from './load-file.js';
import envTraits from './env-traits.js';

const loadJsonFile = async (fileName, isRequired) => {
    const data = await loadFile(fileName, isRequired);
    if (data === null) {
        return {};
    }
    return JSON.parse(data);
};

const denoEnv = Deno.env.toObject();

const env = new Environment({
    name: denoEnv.DENO_ENV,
    traits: parseInt(denoEnv.ENV_TRAITS)
});

const config = wjConfig()
    .addObject(mainConfig)
    .name('Main Configuration')
    .includeEnvironment(env)
    .addPerEnvironment((b, e) => b.addComputed(() => loadJsonFile(`./config.${e}.json`)))
    .addComputed(() => loadJsonFile('config.nonTTY.json'))
    .when(e => !Deno.isatty(Deno.stdout.rid))
    .addComputed(() => loadJsonFile('config.Amiga.json'))
    .whenAllTraits(envTraits.Amiga, 'Amiga Preference')
    .addComputed(() => loadJsonFile('config.Apple.json'))
    .whenAllTraits(envTraits.Apple, 'Apple Preference')
    .addEnvironment(denoEnv)
    .createUrlFunctions()
    .build(true);

export default await config;
