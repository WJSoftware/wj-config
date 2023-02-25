const loadFile = require('./load-file');
const envTraits = require('./env-traits');

module.exports = (async function () {
    const { default: wjConfig, Environment } = await import('wj-config');
    const env = new Environment({
        name: process.env.NODE_ENV,
        traits: parseInt(process.env.ENV_TRAITS)
    });
    return wjConfig()
        .addJson(await loadFile('./config.json', true))
        .name('Main Configuration')
        .includeEnvironment(env)
        .addPerEnvironment((b, e) => b.addJson(() => loadFile(`./config.${e}.json`, false)))
        .addJson(() => loadFile('config.nonTTY.json'))
        .when(e => !process.stdout.isTTY)
        .addJson(() => loadFile('config.Amiga.json'))
        .whenAllTraits(envTraits.Amiga, 'Amiga Preference')
        .addJson(() => loadFile('config.Apple.json'))
        .whenAllTraits(envTraits.Apple, 'Apple Preference')
        .addEnvironment(process.env)
        .createUrlFunctions()
        .build(env.isPreProduction());
})();
