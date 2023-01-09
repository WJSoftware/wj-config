const wjConfig = require('wj-config');
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

const envName = process.env.NODE_ENV;
const mainConfig = loadJsonFile('./config/config.json', true);
const envConfig = loadJsonFile(`./config/config.${envName}.json`, false);
const config = wjConfig([mainConfig, envConfig], envName);

module.exports = config;
