const wjConfig = require('../src/wj-config');
const fs = require('fs');

const loadJsonFile = fileName => {
    const data = fs.readFileSync(fileName, 'utf-8');
    return JSON.parse(data);
};

const config = (env) => {
    env = env ?? process.env;
    const mainConfig = loadJsonFile('./config.json');
    const envConfig = loadJsonFile('./config.Development.json');
    const config = wjConfig({ main: mainConfig, override: envConfig }, env.NODE_ENV, {
        includeEnv: true,
        env: env,
        envPrefix: 'AS_',
        envNames: [
            'MyDev',
            'MyStg',
            'Prod'
        ]
    });
    return config;
};

module.exports = config;
