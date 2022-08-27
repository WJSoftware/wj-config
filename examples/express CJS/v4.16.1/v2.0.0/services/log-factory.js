const structuredLog = require('structured-log');
const consoleSink = new structuredLog.ConsoleSink({
    includeTimestamps: true
});
const configPromise = require('../config');


const logFactory = async (namespace) => {
    const config = await configPromise;
    const normalizeNamespace = ns => ns ? `${config.logging.rootNamespace}.${ns}` : config.logging.rootNamespace;
    return structuredLog.configure()
        .minLevel(config.logging.minLevel)
        .enrich({
            Namespace: normalizeNamespace(namespace)
        })
        .writeTo(consoleSink)
        .create();
};

module.exports = logFactory;
