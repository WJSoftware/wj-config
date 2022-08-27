import config from "../config.js";

export default class PersonService {
    personsPromise;
    constructor() {
        this.personsPromise = fetch(config.ws.mockaroo.person.all(), {
            headers: {
                'x-api-key': config.ws.options.mockaroo.key
            }
        }).then(response => response.json());
    }
    getAll() {
        return this.personsPromise;
    }
    async getById(id) {
        return (await this.personsPromise).find(p => p.id === id);
    }
    async search(filter) {
        return (await this.personsPromise).filter(p => p.country_code === filter.country_code);
    }
};
