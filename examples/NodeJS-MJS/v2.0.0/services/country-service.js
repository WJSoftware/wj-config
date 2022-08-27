import config from "../config.js";

export default async function searchCountries(countryCodes) {
    const response = await fetch(config.ws.countries.search(() => countryCodes.join(',')));
    return await response.json();
}
