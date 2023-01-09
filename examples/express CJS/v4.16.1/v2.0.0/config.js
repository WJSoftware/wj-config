const fs = require('fs');
const envTraits = require('./env-traits');

const loadJsonFile = (fileName, isRequired) => {
    const fileExists = fs.existsSync(fileName);
    if (fileExists) {
        const data = fs.readFileSync(fileName);
        return JSON.parse(data);
    }
    else if (isRequired) {
        throw new Error(`Configuration file ${fileName} is required but was not found.`);
    }
    // Return an empty object.
    return {};
};

module.exports = (async function () {
    const { default: wjConfig, Environment, EnvironmentDefinition } = await import('wj-config');
    const envDef = new EnvironmentDefinition(process.env.NODE_ENV, process.env.ENV_TRAITS);
    const env = new Environment(envDef);
    return wjConfig()
        .addObject(loadJsonFile('./config.json', true))
        .name('Main')
        .includeEnvironment(env)
        .addPerEnvironment((b, e) => b.addComputed(() => loadJsonFile(`./config.${e}.json`)))
        .addComputed(() => loadJsonFile('./config.png.json'))
        .whenAllTraits(envTraits.PngFlags, 'PNG Flags')
        .addComputed(() => loadJsonFile('./config.svg.json'))
        .whenAllTraits(envTraits.SvgFlags, 'SVG Flags')
        .addEnvironment(process.env)
        .includeEnvironment(env)
        .createUrlFunctions()
        .build(env.isDevelopment());
})();
