const envTraits = require('./env-traits');
const loadFile = require('./load-file');

module.exports = (async function () {
    const { default: wjConfig, Environment, EnvironmentDefinition } = await import('wj-config');
    const envDef = new EnvironmentDefinition(process.env.NODE_ENV, parseInt(process.env.ENV_TRAITS));
    const env = new Environment(envDef);
    return wjConfig()
        .addJson(await loadFile('./config.json', true))
        .name('Main')
        .includeEnvironment(env)
        .addPerEnvironment((b, e) => b.addJson(() => loadFile(`./config.${e}.json`, false)))
        .addJson(() => loadFile('./config.png.json'))
        .whenAllTraits(envTraits.PngFlags, 'PNG Flags')
        .addJson(() => loadFile('./config.svg.json'))
        .whenAllTraits(envTraits.SvgFlags, 'SVG Flags')
        .addEnvironment(process.env)
        .includeEnvironment(env)
        .createUrlFunctions()
        .build(env.isDevelopment());
})();
