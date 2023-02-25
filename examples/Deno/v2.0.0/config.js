import wjConfig, { Environment } from 'wj-config';
import mainConfig from "./config.json" assert {type: 'json'};
import loadFile from './load-file.js';
import envTraits from './env-traits.js';

const denoEnv = Deno.env.toObject();

const env = new Environment({
    name: denoEnv.DENO_ENV,
    traits: parseInt(denoEnv.ENV_TRAITS)
});

const config = wjConfig()
    .addObject(mainConfig)
    .name('Main Configuration')
    .includeEnvironment(env)
    .addPerEnvironment((b, e) => b.addJson(() => loadFile(`./config.${e}.json`, false)))
    .addJson(() => loadFile('config.nonTTY.json'))
    .when(e => !Deno.isatty(Deno.stdout.rid))
    .addJson(() => loadFile('config.Amiga.json'))
    .whenAllTraits(envTraits.Amiga, 'Amiga Preference')
    .addJson(() => loadFile('config.Apple.json'))
    .whenAllTraits(envTraits.Apple, 'Apple Preference')
    .addEnvironment(denoEnv)
    .createUrlFunctions()
    .build(true);

export default await config;
