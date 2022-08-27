import wjConfig, { Environment } from "wj-config";
import fs from "fs";

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
    .addObject(loadJsonFile('./config.json', true))
    .name('Main Configuration')
    .addObject(loadJsonFile(`./config.${env.value}.json`))
    .name(`${env.value} Configuration`)
    .addEnvironment(process.env)
    .includeEnvironment(env)
    .createUrlFunctions()
    .build(env.isDevelopment());

export default await config;
