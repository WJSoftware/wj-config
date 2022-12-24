import structuredLog from 'structured-log';
import config from './config.js';

export default function logFactory(sourceContext) {
    return structuredLog.configure()
        .minLevel(config.logging.minLevel)
        .enrich({
            sourceContext: sourceContext
        })
        .writeTo(new structuredLog.ConsoleSink())
        .create()
        ;
};
