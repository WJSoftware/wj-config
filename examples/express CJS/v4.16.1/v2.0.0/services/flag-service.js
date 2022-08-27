const configPromise = require('../config');
const logPromise = require('./log-factory')('flag-service');

function FlagService() {
    this.stats = {};
    this.getByCode = async code => {
        const config = await configPromise;
        const log = await logPromise;
        log.debug('Only in Development -- Code: {CountryCode}', code);
        const response = await fetch(config.ws.flags.flag(() => code));
        if (response.ok) {
            this.stats[code] = this.stats[code] === undefined ? 1 : this.stats[code] + 1;
            const data = await response.arrayBuffer();
            return {
                type: config.ws.options.flags.mimeType,
                data: data
            };
        }
    };
    this.getStats = () => this.stats;
}

module.exports = FlagService;
