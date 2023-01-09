import config from "./config.js";
import getAllPeople from './services/person-service.js';
import searchCountries from "./services/country-service.js"
import logger from './logger.js';
import drawArt from './draw-art.js';

function printUrls(ws, baseName) {
    const result = {};
    for (const key in ws) {
        if (typeof ws[key] === 'function' && key !== 'buildUrl' && key !== '_rootPath') {
            result[`${baseName}:${key}`] = ws[key]();
        }
    }
    console.table(result);
}
await drawArt();
await logger.debug('About to enumerate the different configuration sections...');
for (const [k, v] of Object.entries(config)) {
    console.info('Configuration %s', k);
    console.table(v);
}
await logger.info('About to enumerate the different web services values...');
for (const key in config.ws) {
    printUrls(config.ws[key], key);
}
await logger.warn('About to enumerate all environments...');
for (const env of config.environment.all) {
    console.info('%s environment: %s', env, config.environment[`is${env}`]());
}
const allPeople = await getAllPeople();
const peopleStats = {};
for (const p of allPeople) {
    const count = peopleStats[p.country_code] ?? 0;
    peopleStats[p.country_code] = count + 1;
    if (config.app.outputPeople) {
        console.info(JSON.stringify(p));
    }
}
const countryCodes = [];
for (const cc in peopleStats) {
    countryCodes.push(cc);
}
const countries = await searchCountries(countryCodes);
for (const cc in peopleStats) {
    peopleStats[cc] = {
        Country: countries.find(x => x.cca2 === cc).name.common,
        Count: peopleStats[cc]
    };
}
console.table(peopleStats);
console.info('End.');
