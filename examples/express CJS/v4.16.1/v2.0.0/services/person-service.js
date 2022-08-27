const configPromise = require('../config');

function PersonService() {
    this.personsPromise = (async () => {
        const config = await configPromise;
        return await fetch(config.ws.mockaroo.person.all(), {
            headers: {
                'x-api-key': config.ws.options.mockaroo.key
            }
        }).then(response => response.json());
    })();
    this.getAll = async () => await this.personsPromise;
    this.getById = async (id) => (await this.personsPromise).find(p => p.id === id);
    this.search = async (filter) => (await this.personsPromise).filter(p => p.country_code === filter.country_code);
}

module.exports = PersonService;
