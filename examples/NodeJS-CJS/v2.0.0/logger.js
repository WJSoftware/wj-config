const sl = require('structured-log');
const configPromise = require('./config');

module.exports = (async function () {
    const config = await configPromise;
    return sl.configure()
        .minLevel(config.logging.minLevel)
        .writeTo(new sl.ConsoleSink(config.logging.consoleOptions))
        .create();
})();
