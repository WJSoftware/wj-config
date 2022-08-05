import wjConfig, { Environment } from 'wj-config';
import mainConfig from "./config/config.json" assert {type: 'json'};
import fs from 'fs';

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

const env = new Environment(process.env.NODE_ENV);

const config = wjConfig()
    .addObject(mainConfig)
    .name('Main Configuration')
    .addObject(loadJsonFile(`./config/config.${env.value}.json`))
    .name('Env Configuration')
    .addEnvironment(process.env)
    .includeEnvironment(env)
    .createUrlFunctions()
    .includeValueTrace()
    .build();

export default await config;
