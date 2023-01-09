const configPromise = require('../config');

module.exports = async function getAllPersons() {
    const config = await configPromise;
    const response = await fetch(config.ws.persons.all(), {
        headers: {
            'x-api-key': config.ws.opts.key
        }
    });
    return await response.json();
};
