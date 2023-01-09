const loadFile = require('./load-file');
const envTraits = require('./env-traits');

const loadJsonFile = (fileName, isRequired) => {
    const data = loadFile(fileName, isRequired);
    if (data === null) {
        return {};
    }
    return JSON.parse(data);
};

module.exports = (async function () {
    const { default: wjConfig, Environment } = await import('wj-config');
    const env = new Environment({
        name: process.env.NODE_ENV,
        traits: parseInt(process.env.ENV_TRAITS)
    });
    return wjConfig()
        .addObject(loadJsonFile('./config.json', true))
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
})();
