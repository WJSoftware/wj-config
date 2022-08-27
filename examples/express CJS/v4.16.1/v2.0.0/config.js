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
        .name('Main Configuration') // Give data sources a meaningful name that appears in value traces.
        .addObject(loadJsonFile(`./config.${env.value}.json`))
        .name('Env Configuration')
        .addEnvironment(process.env) // Adds a data source that reads the environment variables in process.env.
        .includeEnvironment(env) // So the final configuration object has the environment property.
        .createUrlFunctions() // So the final configuration object will contain URL builder functions.
        .build(env.isDevelopment()); // Only trace configuration values in the Development environment.
})();
