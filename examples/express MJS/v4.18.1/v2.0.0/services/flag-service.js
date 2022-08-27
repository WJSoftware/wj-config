import config from '../config.js';
import logFactory from './log-factory.js';

export default class FlagService {
    stats;
    log;

    constructor() {
        this.stats = {};
        this.log = logFactory('flag-service');
    }
    async getByCode(code) {
        this.log.debug('Only in Development -- Code: {CountryCode}', code);
        const response = await fetch(config.ws.flags.flag(() => code));
        if (response.ok) {
            this.stats[code] = this.stats[code] === undefined ? 1 : this.stats[code] + 1;
            const data = await response.arrayBuffer();
            return {
                type: config.ws.options.flags.mimeType,
                data: data
            };
        }
        else {
            this.log.error('Could not fetch the flag for code {CountryCode}. Status Code: {StatusCode', code, response.status);
            throw new Error(`Could not fetch the flag for code ${code}. Status Code: ${response.status} (${response.statusText})`);
        }
    }
    getStats() {
        return Promise.resolve(this.stats);
    }
};
