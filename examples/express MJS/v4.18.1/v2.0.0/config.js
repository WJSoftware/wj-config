import wjConfig, { Environment, EnvironmentDefinition } from "wj-config";
import envTraits from "./env-traits.js";
import loadFile from "./load-file.js";

const envDef = new EnvironmentDefinition(process.env.NODE_ENV, parseInt(process.env.ENV_TRAITS));
const env = new Environment(envDef);

const config = await wjConfig()
    .addJson(await loadFile('./config.json', true))
    .name('Main')
    .includeEnvironment(env)
    .addPerEnvironment((b, e) => b.addJson(() => loadFile(`./config.${e}.json`, false)))
    .addJson(() => loadFile('./config.png.json', true))
    .whenAllTraits(envTraits.PngFlags, 'PNG Flags')
    .addJson(() => loadFile('./config.svg.json', true))
    .whenAllTraits(envTraits.SvgFlags, 'SVG Flags')
    .addEnvironment(process.env)
    .createUrlFunctions()
    .build(env.isDevelopment());

export default config;
