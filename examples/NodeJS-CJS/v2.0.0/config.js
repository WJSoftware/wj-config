const fs = require('fs');

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
    const { default: wjConfig, Environment } = await import('wj-config');
    const env = new Environment(process.env.NODE_ENV);
    return wjConfig()
        .addObject(loadJsonFile('./config.json', true))
        .name('Main Configuration')
        .addObject(loadJsonFile(`./config.${env.value}.json`))
        .name(`${env.value} Configuration`)
        .addEnvironment(process.env)
        .includeEnvironment(env)
        .createUrlFunctions()
        .build(env.isPreProduction());
})();
