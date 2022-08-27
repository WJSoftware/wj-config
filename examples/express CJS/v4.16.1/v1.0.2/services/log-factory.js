const structuredLog = require('structured-log');
const consoleSink = new structuredLog.ConsoleSink({
    includeTimestamps: true
});
const config = require('../config');

const normalizeNamespace = ns => ns ? `${config.logging.rootNamespace}.${ns}` : config.logging.rootNamespace;

const logFactory = (namespace) => {
    return structuredLog.configure()
        .minLevel(config.logging.minLevel)
        .enrich({
            Namespace: normalizeNamespace(namespace)
        })
        .writeTo(consoleSink)
        .create();
};

module.exports = logFactory;
