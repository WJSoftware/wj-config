import { LoggerConfiguration, ColoredConsoleSink } from 'serilogger';
import config from './config';

export default function loggerFactory(sourceContext: string) {
    return new LoggerConfiguration()
        .minLevel(config.logging.minLevel)
        .enrich({ SourceContext: sourceContext })
        .writeTo(new ColoredConsoleSink({
            includeProperties: config.logging.outputPropertiesInConsole
        }))
        .create()
        ;
}