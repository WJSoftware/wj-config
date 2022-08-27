import config from "../config.js";

export default async function getAllPersons() {
    const response = await fetch(config.ws.persons.all(), {
        headers: {
            'x-api-key': config.ws.opts.key
        }
    });
    return await response.json();
}
