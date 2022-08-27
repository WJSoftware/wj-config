import config from "./config.js";
import getAllPersons from './services/person-service.js';
import searchCountries from "./services/country-service.js"

function printUrls(ws, baseName) {
    const result = {};
    for (const key in ws) {
        if (typeof ws[key] === 'function' && key !== 'buildUrl' && key !== '_rootPath') {
            result[`${baseName}:${key}`] = ws[key]();
        }
    }
    console.table(result);
}

for (const [k, v] of Object.entries(config)) {
    console.log('Configuration %s', k);
    console.table(v);
}
for (const key in config.ws) {
    printUrls(config.ws[key], key);
}
for (const env of config.environment.names) {
    console.log('%s environment: %s', env, config.environment[`is${env}`]());
}
const allPersons = await getAllPersons();
const personStats = {};
for (const p of allPersons) {
    const count = personStats[p.country_code] ?? 0;
    personStats[p.country_code] = count + 1;
}
const countryCodes = [];
for (const cc in personStats) {
    countryCodes.push(cc);
}
const countries = await searchCountries(countryCodes);
for (const cc in personStats) {
    personStats[cc] = {
        Country: countries.find(x => x.cca2 === cc).name.common,
        Count: personStats[cc]
    };
}
console.table(personStats);
console.log('End.');
