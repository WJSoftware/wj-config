import { LoggerConfiguration, ConsoleSink } from 'structured-log';
import config from './config.js';

const logger = new LoggerConfiguration()
    .minLevel(config.logging.minLevel)
    .writeTo(new ConsoleSink(config.logging.consoleOptions))
    .create();

export default logger;
