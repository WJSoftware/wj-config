const configPromise = require('../config');

module.exports = async function searchCountries(countryCodes) {
    const config = await configPromise;
    const response = await fetch(config.ws.countries.search(() => countryCodes.join(',')));
    return await response.json();
};
